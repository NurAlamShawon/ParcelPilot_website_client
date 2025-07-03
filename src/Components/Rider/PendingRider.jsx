import React, { useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";

const PendingRider = () => {
  const axiosInstance = useAxiosSecure();

  const [selectedRider, setSelectedRider] = useState(null);

  const {
    isPending,
    data: Pendings = [],
    refetch,
  } = useQuery({
    queryKey: ["rider-pendings"],
    queryFn: async () => {
      const res = await axiosInstance.get("/riders/pending");
      return res.data;
    },
  });

  if (isPending) {
    return <p className="text-center">Data is Coming...</p>;
  }

  const handleStatusUpdate = async (id, status, email) => {
    const confirm = await Swal.fire({
      title: `Confirm to ${status}?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!confirm.isConfirmed) return;

    await axiosInstance.patch(`/riders/${id}/status`, { status, email });
    refetch();
    Swal.fire("Success", `Rider has been ${status}`, "success");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Pending Rider Requests
      </h2>

      {/* Large screen: table, small screen: cards */}
      <div>
        {/* Table for md and up */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Contact</th>
                <th className="px-3 py-2 border">Region</th>
                <th className="px-3 py-2 border">Vehicle</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Pendings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No pending riders found.
                  </td>
                </tr>
              ) : (
                Pendings.map((rider) => (
                  <tr key={rider._id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 border">{rider.name}</td>
                    <td className="px-3 py-2 border">{rider.contact}</td>
                    <td className="px-3 py-2 border">{rider.region}</td>
                    <td className="px-3 py-2 border">{rider.vehicleType}</td>
                    <td className="px-3 py-2 border space-x-2">
                      <button
                        onClick={() => setSelectedRider(rider)}
                        className="btn btn-info btn-sm text-white rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(rider._id, "accepted", rider.email)
                        }
                        className="btn btn-success btn-sm text-white rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(rider._id, "rejected", rider.email)
                        }
                        className="btn btn-error btn-sm text-white rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards for small screens */}
        <div className="md:hidden space-y-4">
          {Pendings.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              No pending riders found.
            </p>
          ) : (
            Pendings.map((rider) => (
              <div
                key={rider._id}
                className="border rounded-lg shadow-sm p-4 space-y-2 hover:shadow-md transition"
              >
                <p>
                  <span className="font-semibold">Name:</span> {rider.name}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {rider.contact}
                </p>
                <p>
                  <span className="font-semibold">Region:</span> {rider.region}
                </p>
                <p>
                  <span className="font-semibold">Vehicle:</span>{" "}
                  {rider.vehicleType}
                </p>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setSelectedRider(rider)}
                    className="btn btn-info btn-sm text-white rounded flex-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(rider._id, "accepted", rider.email)
                    }
                    className="btn btn-success btn-sm text-white rounded flex-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(rider._id, "rejected", rider.email)
                    }
                    className="btn btn-error btn-sm text-white rounded flex-1"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rider Full Info Modal */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Blur Background */}
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

          {/* Modal Content */}
          <div className="relative bg-white max-w-md w-full p-6 rounded-lg shadow-xl z-10 overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-3">Rider Details</h3>
            <ul className="space-y-1 text-sm max-w-full break-words">
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
                <strong>NID:</strong> {selectedRider.nid}
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
            </ul>

            <button
              onClick={() => setSelectedRider(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRider;
