import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { ValueContext } from "../../Context/ValueContext";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";

const AddParcel = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [regionsData, setregionsData] = useState([]);
  const [cost, setCost] = useState(0);
  const [formData, setFormData] = useState(null);
  // const navigate = useNavigate();
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = useAxiosSecure();

  useEffect(() => {
    const fetchregionsdata = async () => {
      const res = await fetch("/Coverage.json");
      const data = await res.json();
      const seen = new Set();
      const unique = data.filter((item) => {
        if (seen.has(item.region)) return false;
        seen.add(item.region);
        return true;
      });

      setregionsData(unique);
    };
    fetchregionsdata();
  }, []);

  const generateTrackingId = (region) => {
    const random = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const prefix = region?.slice(0, 3).toUpperCase() || "TRK";
    return `${prefix}-${random}`;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset, // 👈 add this
  } = useForm();

  const type = watch("type");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const getServiceCenters = (region) => {
    if (!Array.isArray(regionsData)) return [];
    return regionsData.find((r) => r.region === region)?.covered_area || [];
  };

  console.log(errors);

  const calculateCost = (data) => {
    const sameRegion = data.receiverServiceCenter === data.senderServiceCenter;
    let base = 0;
    let extraPerKg = 0;
    let extraCharge = 0;

    if (data.type === "document") {
      base = sameRegion ? 60 : 80;
    } else {
      const weight = parseFloat(data.weight || "0");
      if (weight <= 3) {
        base = sameRegion ? 110 : 150;
      } else {
        const extraKg = Math.ceil(weight - 3);
        extraPerKg = extraKg * 40;
        extraCharge = sameRegion ? 0 : 40;
        base = sameRegion ? 110 + extraPerKg : 150 + extraPerKg + extraCharge;
      }
    }

    return { base, extraPerKg, extraCharge, total: base };
  };

  const handleConfirm = () => {
    const parcelData = {
      ...formData,
    };
    console.log("Parcel saved:", parcelData);
    toast.success("Parcel information saved successfully!");
    setShowConfirm(false);
  };

  const onSubmit = (data) => {
    const costBreakdown = calculateCost(data);
    setFormData(data);
    setCost(costBreakdown.total);

    Swal.fire({
      title: "Confirm Parcel",
      html: `
  <div class="text-left text-sm">
    <p><strong>Type:</strong> ${data.type}</p>
    <p><strong>From:</strong> ${data.senderServiceCenter} (${
        data.senderRegion
      })</p>
    <p><strong>To:</strong> ${data.receiverServiceCenter} (${
        data.receiverRegion
      })</p>
    ${
      data.type === "non-document"
        ? `
      <p><strong>Total Weight:</strong> ${parseFloat(data.weight || "0")} kg</p>
      <p><strong>Base Cost (up to 3kg):</strong> ৳${
        data.receiverServiceCenter === data.senderServiceCenter ? 110 : 150
      }</p>
      ${
        parseFloat(data.weight || "0") > 3
          ? `<p><strong>Extra Kg:</strong> ${Math.ceil(
              parseFloat(data.weight || "0") - 3
            )} kg × ৳40 = ৳${costBreakdown.extraPerKg}</p>`
          : ``
      }
    `
        : `<p><strong>Base Cost:</strong> ৳${costBreakdown.base}</p>`
    }
    ${
      data.receiverServiceCenter !== data.senderServiceCenter &&
      data.type === "non-document" &&
      parseFloat(data.weight || "0") > 3
        ? `<p><strong>Extra Region Charge:</strong> ৳${costBreakdown.extraCharge}</p>`
        : ``
    }
    <hr class="my-2"/>
    <p class="text-lg font-semibold">Total: ৳${costBreakdown.total}</p>
  </div>
`,
      showCancelButton: true,
      confirmButtonText: "Go to Transaction",
      cancelButtonText: "Return to Form",
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          creation_date: new Date().toISOString(),
          cost: costBreakdown.total,
          email: currentuser.email,
          tracking_id: generateTrackingId(data.senderRegion),
          payment_status: "unpaid",
        };

        axiosInstance
          .post("/parcels", parcelData)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));

        // simulate API call or send to server
        console.log("Parcel sent to server:", parcelData);
        toast.success("Parcel submitted successfully!");
        reset(); // Reset form fields
        setCost(0); // Reset cost state
        // navigate("/transaction");
      } else {
        toast("You can review and update the form.");
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6  rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-1">Parcel Delivery Form</h2>
      <p className="mb-6 text-gray-600">
        Fill out the form to schedule your parcel pickup and delivery.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <div>
          <h3 className="font-semibold mb-4">Parcel Info</h3>

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="document"
                {...register("type", { required: true })}
              />
              <span>Document</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="non-document"
                {...register("type", { required: true })}
              />
              <span>Non-Document</span>
            </label>
          </div>

          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Parcel Title
              </label>
              <input
                {...register("title", { required: true })}
                placeholder="Parcel Title"
                className="input"
              />
            </div>
            {type === "non-document" && (
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Weight (kg)
                </label>
                <input
                  {...register("weight")}
                  type="number"
                  step="0.1"
                  placeholder="Weight"
                  className="input"
                />
              </div>
            )}
          </div>
        </div>

        <hr className="my-6" />

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sender Info */}
          <div className="flex-1">
            <h3 className="font-semibold mb-4">From Delivery</h3>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sender Name
                </label>
                <input
                  {...register("senderName", { required: true })}
                  placeholder="Sender Name"
                  defaultValue="John Doe"
                  className="input"
                />
              </div>
              <div className="flex-1 relative">
                <label className="block text-sm font-medium mb-1">
                  Pickup Warehouse
                </label>
                <select
                  {...register("senderServiceCenter", { required: true })}
                  className="input appearance-none w-full"
                >
                  <option value="">Select Warehouse</option>
                  {getServiceCenters(senderRegion).map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 absolute right-2 top-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-2 mt-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sender Address
                </label>
                <input
                  {...register("senderAddress", { required: true })}
                  placeholder="Sender Address"
                  className="input"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sender Contact
                </label>
                <input
                  {...register("senderContact", { required: true })}
                  placeholder="Sender Contact"
                  className="input"
                />
              </div>
            </div>

            <div className="mt-2 relative">
              <label className="block text-sm font-medium mb-1">
                Your Region
              </label>
              <select
                {...register("senderRegion", { required: true })}
                className="input w-full appearance-none"
              >
                <option value="">Select Region</option>
                {regionsData.map((r) => (
                  <option key={r.region} value={r.region}>
                    {r.region}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 absolute right-2 top-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Pickup Instruction
              </label>
              <textarea
                {...register("pickupInstruction", { required: true })}
                placeholder="Pickup Instruction"
                className="input h-28 lg:h-36 w-full"
              />
            </div>
          </div>

          {/* Receiver Info */}
          <div className="flex-1">
            <h3 className="font-semibold mb-4">To Delivery</h3>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Receiver Name
                </label>
                <input
                  {...register("receiverName", { required: true })}
                  placeholder="Receiver Name"
                  className="input"
                />
              </div>
              <div className="flex-1 relative">
                <label className="block text-sm font-medium mb-1">
                  Delivery Warehouse
                </label>
                <select
                  {...register("receiverServiceCenter", { required: true })}
                  className="input appearance-none w-full"
                >
                  <option value="">Select Warehouse</option>
                  {getServiceCenters(receiverRegion).map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 absolute right-2 top-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-2 mt-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Receiver Address
                </label>
                <input
                  {...register("receiverAddress", { required: true })}
                  placeholder="Receiver Address"
                  className="input"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Receiver Contact
                </label>
                <input
                  {...register("receiverContact", { required: true })}
                  placeholder="Receiver Contact"
                  className="input"
                />
              </div>
            </div>

            <div className="mt-2 relative">
              <label className="block text-sm font-medium mb-1">
                Receiver Region
              </label>
              <select
                {...register("receiverRegion", { required: true })}
                className="input w-full appearance-none"
              >
                <option value="">Select Region</option>
                {[...new Set(regionsData.map((r) => r.region))].map(
                  (region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  )
                )}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 absolute right-2 top-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Delivery Instruction
              </label>
              <textarea
                {...register("deliveryInstruction", { required: true })}
                placeholder="Delivery Instruction"
                className="input h-28 lg:h-36 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#0096db] text-white px-6 py-2 rounded hover:bg-sky-400 mt-4"
          >
            Submit
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="mt-6 p-4 border rounded-lg bg-green-50">
          <p className="text-green-700 font-medium">Delivery Cost: {cost}৳</p>
          <button
            onClick={handleConfirm}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Confirm & Save
          </button>
        </div>
      )}
    </div>
  );
};

export default AddParcel;
