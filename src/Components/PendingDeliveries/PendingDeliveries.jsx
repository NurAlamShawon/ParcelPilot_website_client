import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ValueContext } from "../../Context/ValueContext";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const PendingDeliveries = () => {
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all parcels assigned to rider
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["rider-parcels", currentuser.email],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/parcels/rider/pending?email=${currentuser.email}&&status=Rider-assigned`
      );
      return res.data;
    },
  });

  // Mutation: Mark as Picked Up
  const startDeliveryMutation = useMutation({
    mutationFn: async ({ parcelId, riderName }) => {
      return axiosInstance.patch(`/parcels/${parcelId}/start-delivery`, {
        riderName,
      });
    },
    onSuccess: (_, variables) => {
      toast.success("Marked as Picked Up");

      // Update local data to Parcel-picked
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

  // Mutation: Mark as Delivered
  const completeDeliveryMutation = useMutation({
    mutationFn: async (parcelId) => {
      return axiosInstance.patch(
        `/parcels/${parcelId}/mark-delivered?email=${currentuser.email}`
      );
    },
    onSuccess: (_, parcelId) => {
      toast.success("Marked as Delivered");

      // Remove the delivered parcel from list
      queryClient.setQueryData(["rider-parcels", currentuser.email], (old) =>
        old?.filter((parcel) => parcel._id !== parcelId)
      );

      // Optionally: re-fetch after short delay
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Deliveries</h2>

      {parcels.length === 0 ? (
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
                      {startDeliveryMutation.isPending
                        ? "Updating..."
                        : "Mark as Picked Up"}
                    </button>
                  )}
                  {parcel.delivery_status === "Parcel-picked" && (
                    <button
                      onClick={() => handleDeliver(parcel._id)}
                      className="btn btn-sm btn-primary"
                      disabled={completeDeliveryMutation.isPending}
                    >
                      {completeDeliveryMutation.isPending
                        ? "Updating..."
                        : "Mark as Delivered"}
                    </button>
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
