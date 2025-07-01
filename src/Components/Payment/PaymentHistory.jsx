import React, { useContext } from "react";
import { ValueContext } from "../../Context/ValueContext";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = useAxiosSecure();

  const {
    data: userpayments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-payments", currentuser?.email],
    enabled: !!currentuser?.email, 
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/payments?email=${currentuser.email}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <p className="text-center text-lg mt-10">Loading payment history...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        Error loading payments: {error.message}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Payment History
      </h2>
      <table className="table table-zebra w-full border border-gray-300 rounded-xl">
        <thead className="bg-base-200 text-base font-semibold text-gray-700">
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Tracking ID</th>
            <th>Transaction ID</th>
            <th>Payment Method</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {userpayments.map((payment, index) => (
            <tr key={payment._id}>
              <th>{index + 1}</th>
              <td>{payment.email}</td>
              <td>${(payment.amount / 100).toFixed(2)}</td>
              <td>{payment.currency.toUpperCase()}</td>
              <td>{payment.tracking_id}</td>
              <td className="break-all">{payment.transactionId}</td>
              <td>{payment.paymentMethod}</td>
              <td>{new Date(payment.paidAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
