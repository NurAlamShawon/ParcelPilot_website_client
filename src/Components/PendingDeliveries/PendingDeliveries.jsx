import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ValueContext } from "../../Context/ValueContext";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const PendingDeliveries = () => {
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["rider-parcels", currentuser.email],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/parcels/rider/pending?email=${currentuser.email}&&status=Rider-assigned`
      );
      return res.data;
    },
  });

  const startDeliveryMutation = useMutation({
    mutationFn: async ({ parcelId, riderName }) => {
      return axiosInstance.patch(`/parcels/${parcelId}/start-delivery`, {
        riderName,
      });
    },
    onSuccess: (_, variables) => {
      toast.success("Marked as Picked Up");
      queryClient.setQueryData(["rider-parcels", currentuser.email], (old) =>
        old?.map((parcel) =>
          parcel._id === variables.parcelId
            ? { ...parcel, delivery_status: "Parcel-picked" }
            : parcel
        )
      );
    },
    onError: () => toast.error("Failed to mark as picked up"),
  });

  const completeDeliveryMutation = useMutation({
    mutationFn: async (parcelId) => {
      return axiosInstance.patch(
        `/parcels/${parcelId}/mark-delivered?email=${currentuser.email}`
      );
    },
    onSuccess: (_, parcelId) => {
      toast.success("Marked as Delivered");
      queryClient.setQueryData(["rider-parcels", currentuser.email], (old) =>
        old?.filter((parcel) => parcel._id !== parcelId)
      );
      setTimeout(() => {
        queryClient.invalidateQueries(["rider-parcels", currentuser.email]);
      }, 1000);
    },
    onError: () => toast.error("Failed to mark as delivered"),
  });

  const handlePickUp = (parcel) => {
    startDeliveryMutation.mutate({
      parcelId: parcel._id,
      riderName: parcel.assigned_rider_name,
    });
  };

  const handleDeliver = (parcelId) => {
    completeDeliveryMutation.mutate(parcelId);
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">My Deliveries</h2>

      {parcels.length === 0 ? (
        <p className="text-center">No parcels assigned to you.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th>Tracking ID</th>
                <th>Sender</th>
                <th>Status</th>
                <th>Pickup Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.senderName}</td>
                  <td>{parcel.delivery_status}</td>
                  <td>{parcel.senderAddress}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => setSelectedParcel(parcel)}
                      >
                        View Details
                      </button>

                      {parcel.delivery_status === "Rider-assigned" && (
                        <button
                          onClick={() => handlePickUp(parcel)}
                          className="btn btn-xs btn-success"
                          disabled={startDeliveryMutation.isPending}
                        >
                          {startDeliveryMutation.isPending
                            ? "Updating..."
                            : "Mark as Picked Up"}
                        </button>
                      )}

                      {parcel.delivery_status === "Parcel-picked" && (
                        <button
                          onClick={() => handleDeliver(parcel._id)}
                          className="btn btn-xs btn-primary"
                          disabled={completeDeliveryMutation.isPending}
                        >
                          {completeDeliveryMutation.isPending
                            ? "Updating..."
                            : "Mark as Delivered"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for parcel details */}
      {selectedParcel && (
        <dialog id="details_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md sm:max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Parcel Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Tracking ID:</strong> {selectedParcel.tracking_id}</p>
              <p><strong>Sender Name:</strong> {selectedParcel.senderName}</p>
              <p><strong>Sender Address:</strong> {selectedParcel.senderAddress}</p>
              <p><strong>Receiver Name:</strong> {selectedParcel.receiverName}</p>
              <p><strong>Receiver Address:</strong> {selectedParcel.receiverAddress}</p>
              <p><strong>Service Center:</strong> {selectedParcel.senderServiceCenter}</p>
              <p><strong>Status:</strong> {selectedParcel.delivery_status}</p>
              <p><strong>Cost:</strong> {selectedParcel.cost} BDT</p>
              <p><strong>Note:</strong> {selectedParcel.pickupInstruction || "None"}</p>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-sm"
                onClick={() => setSelectedParcel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingDeliveries;
