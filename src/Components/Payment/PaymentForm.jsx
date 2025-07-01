import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { ValueContext } from "../../Context/ValueContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";

const PaymentForm = ({ id }) => {
  const parcel_id = id;
  const [error, seterror] = useState("");
  const axiosInstance = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const { currentuser } = useContext(ValueContext);

  const { data: parcelinfo = {} } = useQuery({
    queryKey: ["parcels", parcel_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/parcels/${parcel_id}`);
      return res.data;
    },
  });

  const amount = parcelinfo?.cost || 0;
  const amountInCent = amount * 100;

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to pay $${amount}. Do you want to continue?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Proceed to Payment",
    cancelButtonText: "Undo",
  });

  // ❌ If user clicks 'Undo'
  if (!confirmation.isConfirmed) {
    return Swal.fire("Cancelled", "Payment was cancelled.", "info");
  }

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      seterror(error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      seterror("");
      const res = await axiosInstance.post("/create-payment-intent", {
        amountInCent,
        parcel_id,
      });

      console.log(res);

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: currentuser.userName,
          },
        },
      });

      if (result.error) {
        // Show error to your customer
        console.log(result.error.message);
        seterror(result.error);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // Show a success message to your customer
          console.log("Payment succeeded!");

          console.log(result);

          const paymentInfo = {
            amount: result.paymentIntent.amount,
            currency: result.paymentIntent.currency,
            tracking_id: parcelinfo.tracking_id,
            _id: parcel_id,
            email: currentuser?.email,
            transactionId: result.paymentIntent.id,
            paymentMethod: result.paymentIntent.payment_method_types[0],
            paidAt: new Date(result.paymentIntent.created * 1000).toISOString(),
          };

          axiosInstance.post('/payments',paymentInfo).then(res=> console.log(res));
           Swal.fire("Success!", "Your payment was successful.", "success");
        }
      }
    }


  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-16 bg-white rounded-2xl shadow-xl p-10 space-y-8 border border-gray-200"
    >
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Complete Your Payment
        </h2>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Card Details
        </label>
        <CardElement className="w-full p-5 bg-gray-100 border-2 border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-400" />
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full py-4 text-xl font-bold btn btn-success disabled:opacity-50"
      >
        Pay ${parcelinfo.cost}
      </button>
      {error && <p className="text-red-600 text-center">{error.message}</p>}
    </form>
  );
};

export default PaymentForm;
