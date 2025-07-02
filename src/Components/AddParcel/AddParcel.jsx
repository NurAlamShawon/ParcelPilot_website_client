import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { ValueContext } from "../../Context/ValueContext";
import Useaxios from "../../Hooks/Useaxios";

const AddParcel = () => {
  const [regionsData, setregionsData] = useState([]);
  const [cost, setCost] = useState(null);
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = Useaxios();

  const [senderDistricts, setSenderDistricts] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const type = watch("type");
  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const receiverRegion = watch("receiverRegion");
  const receiverDistrict = watch("receiverDistrict");

  // Fetch coverage data once
  useEffect(() => {
    const fetchregionsdata = async () => {
      const res = await fetch("/Coverage.json");
      const data = await res.json();
      setregionsData(data);
    };
    fetchregionsdata();
  }, []);

  // Update sender districts when senderRegion changes
  useEffect(() => {
    if (!senderRegion) {
      setSenderDistricts([]);
      return;
    }
    const districts = regionsData
      .filter((item) => item.region === senderRegion)
      .map((item) => item.district);
    setSenderDistricts([...new Set(districts)]);
  }, [senderRegion, regionsData]);

  // Update receiver districts when receiverRegion changes
  useEffect(() => {
    if (!receiverRegion) {
      setReceiverDistricts([]);
      return;
    }
    const districts = regionsData
      .filter((item) => item.region === receiverRegion)
      .map((item) => item.district);
    setReceiverDistricts([...new Set(districts)]);
  }, [receiverRegion, regionsData]);

  // Get warehouses filtered by region and district
  const getServiceCenters = (region, district) => {
    if (!Array.isArray(regionsData)) return [];
    return (
      regionsData.find((r) => r.region === region && r.district === district)
        ?.covered_area || []
    );
  };

  const generateTrackingId = (region) => {
    const random = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const prefix = region?.slice(0, 3).toUpperCase() || "TRK";
    return `${prefix}-${random}`;
  };

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

  const onSubmit = (data) => {
    const costBreakdown = calculateCost(data);
    setCost(costBreakdown.total);

    Swal.fire({
      title: "Confirm Parcel",
      html: `
  <div class="text-left text-sm">
    <p><strong>Type:</strong> ${data.type}</p>
    <p><strong>From:</strong> ${data.senderServiceCenter} (${
        data.senderDistrict
      }, ${data.senderRegion})</p>
    <p><strong>To:</strong> ${data.receiverServiceCenter} (${
        data.receiverDistrict
      }, ${data.receiverRegion})</p>
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
          delivery_status: "not-collected",
        };

        axiosInstance
          .post("/parcels", parcelData)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));

        toast.success("Parcel submitted successfully!");
        reset();
        setCost(null);
      } else {
        toast("You can review and update the form.");
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 rounded-xl shadow">
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
                {...register("type", { required: "Please select parcel type" })}
              />
              <span>Document</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="non-document"
                {...register("type", { required: "Please select parcel type" })}
              />
              <span>Non-Document</span>
            </label>
          </div>
          {errors.type && (
            <p className="text-red-600 text-sm mb-2">{errors.type.message}</p>
          )}

          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Parcel Title
              </label>
              <input
                {...register("title", { required: "Parcel title is required" })}
                placeholder="Parcel Title"
                className="input"
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title.message}</p>
              )}
            </div>
            {type === "non-document" && (
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Weight (kg)
                </label>
                <input
                  {...register("weight", {
                    required: "Weight is required for non-documents",
                    valueAsNumber: true,
                    min: { value: 0.1, message: "Weight must be positive" },
                  })}
                  type="number"
                  step="0.1"
                  placeholder="Weight"
                  className="input"
                />
                {errors.weight && (
                  <p className="text-red-600 text-sm">
                    {errors.weight.message}
                  </p>
                )}
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
                  {...register("senderName", {
                    required: "Sender name is required",
                  })}
                  placeholder="Sender Name"
                  defaultValue="John Doe"
                  className="input"
                />
                {errors.senderName && (
                  <p className="text-red-600 text-sm">
                    {errors.senderName.message}
                  </p>
                )}
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm font-medium mb-1">
                  Your Region
                </label>
                <select
                  {...register("senderRegion", {
                    required: "Please select sender region",
                  })}
                  className="input w-full appearance-none"
                >
                  <option value="">Select Region</option>
                  {regionsData
                    .map((r) => r.region)
                    .filter((v, i, a) => a.indexOf(v) === i) // unique regions
                    .map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                </select>
                {errors.senderRegion && (
                  <p className="text-red-600 text-sm">
                    {errors.senderRegion.message}
                  </p>
                )}
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
                  {...register("senderAddress", {
                    required: "Sender address is required",
                  })}
                  placeholder="Sender Address"
                  className="input"
                />
                {errors.senderAddress && (
                  <p className="text-red-600 text-sm">
                    {errors.senderAddress.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sender Contact
                </label>
                <input
                  {...register("senderContact", {
                    required: "Sender contact is required",
                  })}
                  placeholder="Sender Contact"
                  className="input"
                />
                {errors.senderContact && (
                  <p className="text-red-600 text-sm">
                    {errors.senderContact.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2 relative">
              <label className="block text-sm font-medium mb-1">
                Sender District
              </label>
              <select
                {...register("senderDistrict", {
                  required: "Please select sender district",
                })}
                className="input w-full appearance-none"
                disabled={!senderDistricts.length}
              >
                <option value="">Select District</option>
                {senderDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.senderDistrict && (
                <p className="text-red-600 text-sm">
                  {errors.senderDistrict.message}
                </p>
              )}
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

            <div className="mt-2  relative">
              <label className="block text-sm font-medium mb-1">
                Pickup Warehouse
              </label>
              <select
                {...register("senderServiceCenter", {
                  required: "Please select pickup warehouse",
                })}
                className="input appearance-none w-full"
                disabled={!senderDistrict}
              >
                <option value="">Select Warehouse</option>
                {senderDistrict &&
                  getServiceCenters(senderRegion, senderDistrict).map(
                    (center) => (
                      <option key={center} value={center}>
                        {center}
                      </option>
                    )
                  )}
              </select>
              {errors.senderServiceCenter && (
                <p className="text-red-600 text-sm">
                  {errors.senderServiceCenter.message}
                </p>
              )}
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
                {...register("pickupInstruction", {
                  required: "Pickup instruction is required",
                })}
                placeholder="Pickup Instruction"
                className="input h-28 lg:h-36 w-full"
              />
              {errors.pickupInstruction && (
                <p className="text-red-600 text-sm">
                  {errors.pickupInstruction.message}
                </p>
              )}
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
                  {...register("receiverName", {
                    required: "Receiver name is required",
                  })}
                  placeholder="Receiver Name"
                  className="input"
                />
                {errors.receiverName && (
                  <p className="text-red-600 text-sm">
                    {errors.receiverName.message}
                  </p>
                )}
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm font-medium mb-1">
                  Receiver Region
                </label>
                <select
                  {...register("receiverRegion", {
                    required: "Please select receiver region",
                  })}
                  className="input w-full appearance-none"
                >
                  <option value="">Select Region</option>
                  {regionsData
                    .map((r) => r.region)
                    .filter((v, i, a) => a.indexOf(v) === i) // unique regions
                    .map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                </select>
                {errors.receiverRegion && (
                  <p className="text-red-600 text-sm">
                    {errors.receiverRegion.message}
                  </p>
                )}
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
                  {...register("receiverAddress", {
                    required: "Receiver address is required",
                  })}
                  placeholder="Receiver Address"
                  className="input"
                />
                {errors.receiverAddress && (
                  <p className="text-red-600 text-sm">
                    {errors.receiverAddress.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Receiver Contact
                </label>
                <input
                  {...register("receiverContact", {
                    required: "Receiver contact is required",
                  })}
                  placeholder="Receiver Contact"
                  className="input"
                />
                {errors.receiverContact && (
                  <p className="text-red-600 text-sm">
                    {errors.receiverContact.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2 relative">
              <label className="block text-sm font-medium mb-1">
                Receiver District
              </label>
              <select
                {...register("receiverDistrict", {
                  required: "Please select receiver district",
                })}
                className="input w-full appearance-none"
                disabled={!receiverDistricts.length}
              >
                <option value="">Select District</option>
                {receiverDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.receiverDistrict && (
                <p className="text-red-600 text-sm">
                  {errors.receiverDistrict.message}
                </p>
              )}
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

            <div className="mt-2 relative">
              <label className="block text-sm font-medium mb-1">
                Delivery Warehouse
              </label>
              <select
                {...register("receiverServiceCenter", {
                  required: "Please select delivery warehouse",
                })}
                className="input appearance-none w-full"
                disabled={!receiverDistrict}
              >
                <option value="">Select Warehouse</option>
                {receiverDistrict &&
                  getServiceCenters(receiverRegion, receiverDistrict).map(
                    (center) => (
                      <option key={center} value={center}>
                        {center}
                      </option>
                    )
                  )}
              </select>
              {errors.receiverServiceCenter && (
                <p className="text-red-600 text-sm">
                  {errors.receiverServiceCenter.message}
                </p>
              )}
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
                {...register("deliveryInstruction", {
                  required: "Delivery instruction is required",
                })}
                placeholder="Delivery Instruction"
                className="input h-28 lg:h-36 w-full"
              />
              {errors.deliveryInstruction && (
                <p className="text-red-600 text-sm">
                  {errors.deliveryInstruction.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="bg-[#0096db] text-white px-6 py-2 rounded hover:bg-sky-400 mt-4"
          >
            Submit
          </button>

          {/* Show cost if calculated */}
          {cost !== null && (
            <p className="mt-4 text-lg font-semibold text-green-700">
              Estimated Cost: ৳{cost}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddParcel;
