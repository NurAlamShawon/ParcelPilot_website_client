import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { ValueContext } from "../../Context/ValueContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";

const RiderForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const axiosInstance = useAxiosSecure();
  const { currentuser } = useContext(ValueContext);

  const [coverageData, setCoverageData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/Coverage.json");
        const data = await res.json();
        setCoverageData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Populate districts based on selected region
  useEffect(() => {
    if (!selectedRegion) {
      setDistricts([]);
      setWarehouses([]);
      return;
    }

    const regionDistricts = coverageData
      .filter((item) => item.region === selectedRegion)
      .map((item) => item.district);

    setDistricts([...new Set(regionDistricts)]);
    setWarehouses([]); // Reset warehouses when region changes
  }, [selectedRegion, coverageData]);

  // Populate warehouses based on selected region + district
  useEffect(() => {
    if (!selectedRegion || !selectedDistrict) {
      setWarehouses([]);
      return;
    }

    const matched = coverageData.find(
      (item) =>
        item.region === selectedRegion && item.district === selectedDistrict
    );

    setWarehouses(matched?.covered_area || []);
  }, [selectedDistrict, selectedRegion, coverageData]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        email: currentuser?.email,
        status: "pending",
        joined_at: new Date().toISOString(),
      };

      await axiosInstance.post("/riders", payload);
      Swal.fire("Success!", "Your application has been submitted.", "success");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Something went wrong. Try again later.", "error");
    }
  };

  return (
    <div className=" max-w-6xl mx-auto my-10 xl:flex flex-row items-center justify-around p-10 rounded-2xl bg-white">
      <div className="max-w-4xl  mx-auto mt-10 p-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Be a Rider</h2>
        <p className="text-gray-600 mb-8">
          Join our delivery team and make a difference. Fast, reliable, and
          rewarding.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              {...register("name", { required: true })}
              placeholder="Your Name"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">Name is required</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Age</label>
            <input
              type="number"
              {...register("age", { required: true })}
              placeholder="Your Age"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.age && (
              <p className="text-red-500 text-sm">Age is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Your Email"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">Email is required</p>
            )}
          </div>

          {/* NID */}
          <div>
            <label className="block text-sm font-medium mb-1">NID No</label>
            <input
              {...register("nid", { required: true })}
              placeholder="NID"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.nid && (
              <p className="text-red-500 text-sm">NID is required</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">Contact</label>
            <input
              {...register("contact", { required: true })}
              placeholder="Contact"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">Contact is required</p>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Your Region
            </label>
            <select
              {...register("region", { required: true })}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select your region</option>
              {[...new Set(coverageData.map((item) => item.region))].map(
                (region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                )
              )}
            </select>
            {errors.region && (
              <p className="text-red-500 text-sm">Region is required</p>
            )}
          </div>

          {/* District */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Your District
            </label>
            <select
              {...register("district", { required: true })}
              className="w-full border px-4 py-2 rounded"
              disabled={!districts.length}
            >
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-sm">District is required</p>
            )}
          </div>

          {/* Warehouse */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Which warehouse do you want to work?
            </label>
            <select
              {...register("warehouse", { required: true })}
              className="w-full border px-4 py-2 rounded"
              disabled={!warehouses.length}
            >
              <option value="">Select warehouse</option>
              {warehouses.map((w, i) => (
                <option key={i} value={w}>
                  {w}
                </option>
              ))}
            </select>
            {errors.warehouse && (
              <p className="text-red-500 text-sm">Warehouse is required</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Vehicle Type
            </label>
            <select
              {...register("vehicleType", { required: true })}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select vehicle type</option>
              <option value="Bike">Bike</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
            </select>
            {errors.vehicleType && (
              <p className="text-red-500 text-sm">Vehicle type is required</p>
            )}
          </div>

          {/* Vehicle Info */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Vehicle Info (License/Reg. No)
            </label>
            <input
              {...register("vehicleInfo", { required: true })}
              placeholder="E.g., DHA-123456"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.vehicleInfo && (
              <p className="text-red-500 text-sm">Vehicle info is required</p>
            )}
          </div>

          {/* Driving License */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Driving License No
            </label>
            <input
              {...register("drivingLicense", { required: true })}
              placeholder="e.g., DL-123456789"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.drivingLicense && (
              <p className="text-red-500 text-sm">
                Driving license number is required
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div>
        <img src="https://i.postimg.cc/q7sGLM9Y/agent-pending.png" alt="" />
      </div>
    </div>
  );
};

export default RiderForm;
