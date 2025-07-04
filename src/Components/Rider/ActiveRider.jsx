import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";


const ActiveRider = () => {
  const axiosInstance = useAxiosSecure();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: activeRiders = [],
    isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/riders/accepted");
      return res.data;
    },
  });

  const filteredRiders = activeRiders.filter(
    (rider) =>
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <p className="text-center my-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by name, email or contact"
        className="mb-4 px-4 py-2 border rounded w-full md:w-1/2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table for md and above */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Region</th>
              <th className="px-4 py-2 border">Warehouse</th>
              <th className="px-4 py-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No active riders found.
                </td>
              </tr>
            ) : (
              filteredRiders.map((rider) => (
                <tr key={rider._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{rider.name}</td>
                  <td className="px-4 py-2 border">{rider.email}</td>
                  <td className="px-4 py-2 border">{rider.contact}</td>
                  <td className="px-4 py-2 border">{rider.region}</td>
                  <td className="px-4 py-2 border">{rider.warehouse}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => {
                        document.getElementById("rider_modal").showModal();
                        setSelectedRider(rider);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card/List view for mobile */}
      <div className="block md:hidden space-y-4">
        {filteredRiders.length === 0 ? (
          <p className="text-center text-gray-500">No active riders found.</p>
        ) : (
          filteredRiders.map((rider) => (
            <div
              key={rider._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{rider.name}</h3>
                  <p className="text-gray-600 text-sm">{rider.email}</p>
                  <p className="text-gray-600 text-sm">{rider.contact}</p>
                  <p className="text-gray-600 text-sm">
                    Region: {rider.region}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Warehouse: {rider.warehouse}
                  </p>
                </div>
                <button
                  onClick={() => {
                    document.getElementById("rider_modal").showModal();
                    setSelectedRider(rider);
                  }}
                  className="text-blue-600 hover:underline whitespace-nowrap self-start"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rider Detail Modal */}
      <dialog id="rider_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Rider Details</h3>
          {selectedRider && (
            <ul className="text-sm space-y-1">
              <li>
                <strong>Name:</strong> {selectedRider.name}
              </li>
              <li>
                <strong>Email:</strong> {selectedRider.email}
              </li>
              <li>
                <strong>Contact:</strong> {selectedRider.contact}
              </li>
              <li>
                <strong>Region:</strong> {selectedRider.region}
              </li>
              <li>
                <strong>Warehouse:</strong> {selectedRider.warehouse}
              </li>
              <li>
                <strong>Vehicle Type:</strong> {selectedRider.vehicleType}
              </li>
              <li>
                <strong>Vehicle Info:</strong> {selectedRider.vehicleInfo}
              </li>
              <li>
                <strong>Driving License:</strong> {selectedRider.license}
              </li>
              <li>
                <strong>NID:</strong> {selectedRider.nid}
              </li>
            </ul>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ActiveRider;
