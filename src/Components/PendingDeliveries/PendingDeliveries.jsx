import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ValueContext } from "../../Context/ValueContext";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";

const PendingDeliveries = () => {
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all parcels assigned to rider
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["rider-parcels", currentuser.email],
    queryFn: async () => {
      const res = await axiosInstance.get(`/parcels/rider/pending?email=${currentuser.email}&&status=Rider-assigned`);
      return res.data;
    },
  });

  // Mutation: Mark as Picked Up
  const startDeliveryMutation = useMutation({
    mutationFn: async ({ parcelId, riderName }) => {
      return axiosInstance.patch(`/parcels/${parcelId}/start-delivery`, { riderName });
    },
    onSuccess: () => {
      toast.success("Marked as Picked Up");
      queryClient.invalidateQueries(["rider-parcels", currentuser.email]);
    },
    onError: () => toast.error("Failed to mark as picked up"),
  });

  // Mutation: Mark as Delivered
  const completeDeliveryMutation = useMutation({
    mutationFn: async (parcelId) => {
      return axiosInstance.patch(`/parcels/${parcelId}/mark-delivered?email=${currentuser.email}`);
    },
    onSuccess: () => {
      toast.success("Marked as Delivered");
      queryClient.invalidateQueries(["rider-parcels", currentuser.email]);
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Deliveries</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : parcels.length === 0 ? (
        <p>No parcels assigned to you.</p>
      ) : (
        <table className="table w-full border">
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
                  {parcel.delivery_status === "Rider-assigned" && (
                    <button
                      onClick={() => handlePickUp(parcel)}
                      className="btn btn-sm btn-success"
                      disabled={startDeliveryMutation.isPending}
                    >
                      {startDeliveryMutation.isPending ? "Updating..." : "Mark as Picked Up"}
                    </button>
                  )}
                  {parcel.delivery_status === "Parcel-picked" && (
                    <button
                      onClick={() => handleDeliver(parcel._id)}
                      className="btn btn-sm btn-primary"
                      disabled={completeDeliveryMutation.isPending}
                    >
                      {completeDeliveryMutation.isPending ? "Updating..." : "Mark as Delivered"}
                    </button>
                  )}
                  {parcel.delivery_status === "Delivered" && (
                    <span className="text-green-600 font-semibold">Delivered</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingDeliveries;
