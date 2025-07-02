import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { ValueContext } from "../../Context/ValueContext";

const PendingRider = () => {
  const axiosSecure = useAxiosSecure();
  const { currentuser } = useContext(ValueContext);

  const [selectedRider, setSelectedRider] = useState(null);

  const {
    isPending,
    data: Pendings = [],
    refetch,
  } = useQuery({
    queryKey: ["rider-pendings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
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

    await axiosSecure.patch(`/riders/${id}/status`, { status, email });
    refetch();
    Swal.fire("Success", `Rider has been ${status}`, "success");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Pending Rider Requests
      </h2>
      <div className="overflow-x-auto text-sm">
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
                      className="px-2 py-1
                       btn btn-info text-white rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(rider._id, "accepted", currentuser.email)
                      }
                      className="px-2 py-1 btn btn-success text-white rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(rider._id, "rejected", currentuser.email)
                      }
                      className="px-2 py-1 btn btn-error text-white rounded"
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

      {/* Rider Full Info Modal */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Background Effect */}
          <div className="absolute inset-0 backdrop-blur-sm transition-opacity duration-300"></div>

          {/* Modal Content */}
          <div className="relative bg-white max-w-md w-full p-6 rounded-lg shadow-xl z-10">
            <h3 className="text-xl font-bold mb-3">Rider Details</h3>
            <ul className="space-y-1 text-sm">
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
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRider;
