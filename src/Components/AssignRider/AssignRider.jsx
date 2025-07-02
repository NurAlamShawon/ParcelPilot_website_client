import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Fetch all parcels that are paid and not collected
  const { data: parcels = [] } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/parcels?payment_status=paid&delivery_status=not-collected"
      );
      return res.data;
    },
  });

  // Fetch active riders in selected district (only when selectedParcel is open)
  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["activeRiders", selectedDistrict],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/riders?district=${selectedDistrict}`
      );
      return res.data;
    },
    enabled: !!selectedDistrict,
  });

  // Mutation: Assign rider to parcel
  const assignMutation = useMutation({
    mutationFn: async ({ parcelId, riderId }) => {
      return axiosInstance.patch(`/parcels/assign/${parcelId}`, {
        rider_id: riderId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignableParcels"]);
      setSelectedParcel(null); // close modal
    },
  });

  const openAssignModal = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedDistrict(parcel.senderDistrict);
  };

  const handleAssign = async (riderId, riderName) => {
    const confirm = await Swal.fire({
      title: "Confirm Assignment",
      text: `Are you sure you want to assign ${riderName} to this parcel?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosInstance.patch(`/parcels/${selectedParcel._id}/assign`, {
        riderId,
        ridername: riderName,
      });

      toast.success("Rider assigned successfully!");
      queryClient.invalidateQueries(["assignableParcels"]);
      setSelectedParcel(null); // close modal
    } catch (err) {
      toast.error("Failed to assign rider");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Assign Rider to Parcels
      </h2>

      {/* Table for Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Pickup</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.senderName}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.senderAddress}</td>
                <td>{parcel.receiverAddress}</td>
                <td>{parcel.delivery_status}</td>
                <td>
                  <label
                    htmlFor="assign-modal"
                    className="btn btn-sm btn-primary"
                    onClick={() => openAssignModal(parcel)}
                  >
                    Assign Rider
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedParcel && (
        <>
          <input
            type="checkbox"
            id="assign-modal"
            className="modal-toggle"
            checked
            readOnly
          />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Assign Rider to: {selectedParcel.tracking_id}
              </h3>

              {ridersLoading ? (
                <p className="text-gray-600 mt-4">Loading riders...</p>
              ) : riders.length === 0 ? (
                <p className="text-red-500 mt-4">
                  No riders found in this district
                </p>
              ) : (
                <ul className="space-y-3 mt-4 max-h-60 overflow-y-auto">
                  {riders.map((rider) => (
                    <li
                      key={rider._id}
                      className="p-3 border rounded shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{rider.name}</p>
                        <p className="text-sm text-gray-500">{rider.phone}</p>
                      </div>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={assignMutation.isPending}
                        onClick={() => handleAssign(rider._id, rider.name)}
                      >
                        {assignMutation.isPending ? "Assigning..." : "Assign"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="modal-action">
                <label
                  htmlFor="assign-modal"
                  className="btn"
                  onClick={() => setSelectedParcel(null)}
                >
                  Close
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignRider;
