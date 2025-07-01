import React, { useEffect, useState } from "react";
import Useaxios from "../../Hooks/Useaxios";

const PendingRider = () => {
  const [pendingRiders, setPendingRiders] = useState([]);
  const axiosInstance = Useaxios();

  useEffect(() => {
    const fetchPendingRiders = async () => {
      try {
        const res = await axiosInstance.get("/riders/pending");
        setPendingRiders(res.data);
      } catch (error) {
        console.error("Error fetching pending riders:", error);
      }
    };

    fetchPendingRiders();
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Pending Riders</h2>
      <div className="overflow-x-auto rounded-md shadow">
        <table className="min-w-full table-auto text-sm sm:text-base">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Region</th>
              <th className="px-4 py-2 border">Vehicle</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingRiders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No pending riders found.
                </td>
              </tr>
            ) : (
              pendingRiders.map((rider, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{rider.name}</td>
                  <td className="px-4 py-2 border">{rider.contact}</td>
                  <td className="px-4 py-2 border">{rider.region}</td>
                  <td className="px-4 py-2 border">
                    {rider.vehicleType || "N/A"}
                  </td>
                  <td className="px-4 py-2 border capitalize text-yellow-600">
                    {rider.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRider;
