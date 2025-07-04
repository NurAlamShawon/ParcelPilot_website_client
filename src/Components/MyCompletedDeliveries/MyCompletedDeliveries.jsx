import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ValueContext } from "../../Context/ValueContext";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";


const MyCompletedDeliveries = () => {
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch completed parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completed-parcels", currentuser.email],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/parcels/rider/completed?email=${currentuser.email}`
      );
      return res.data;
    },
  });

  // Fetch rider profile (for earnings)
  const { data: rider = {}, refetch } = useQuery({
    queryKey: ["rider-profile", currentuser.email],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/riders/profile?email=${currentuser.email}`
      );
      return res.data;
    },
  });

  console.log(rider)

  // Mutation to cashout
  const cashoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch("/riders/cashout", {
        email: currentuser.email,
         amount: rider.earnings,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Cashout successful: ৳${data.cashout.amount}`);

      queryClient.invalidateQueries(["rider-profile", currentuser.email]);
      refetch();
    },
    onError: () => {
      toast.error("Cashout failed or no earnings available.");
    },
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        My Completed Deliveries
      </h2>

      <div className="mb-4 text-right">
        <p className="text-green-600 font-semibold">
          Current Earnings: ৳{rider?.earnings || 0}
        </p>
        <button
          className="btn btn-warning btn-sm mt-2"
          onClick={() => cashoutMutation.mutate()}
          disabled={
            cashoutMutation.isPending || !rider?.earnings || rider.earnings <= 0
          }
        >
          {cashoutMutation.isPending ? "Processing..." : "Cash Out"}
        </button>
      </div>

      {isLoading ? (
        <p>Loading deliveries...</p>
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No completed deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th>Tracking ID</th>
                <th>Pickup</th>
                <th>Destination</th>
                <th>Cost (৳)</th>
                <th>Your Earning (৳)</th>
                <th>History</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => {
                const cost = parcel.cost || 0;
                const sameDistrict =
                  parcel.senderDistrict === parcel.receiverDistrict;
                const earning = sameDistrict ? cost * 0.8 : cost * 0.3;

                return (
                  <tr key={parcel._id}>
                    <td className="text-xs">{parcel.tracking_id}</td>
                    <td className="text-xs">{parcel.senderAddress}</td>
                    <td className="text-xs">{parcel.receiverAddress}</td>
                    <td className="text-xs">{cost.toFixed(2)}</td>
                    <td className="text-xs text-green-600 font-semibold">
                      {earning.toFixed(2)}
                    </td>
                    <td>
                      <ul className="text-xs text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                        {parcel.logs?.map((log, index) => (
                          <li key={index}>
                            <strong>{log.status}</strong>:{" "}
                            {new Date(log.timestamp).toLocaleString()}
                            {log.note && ` — ${log.note}`}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCompletedDeliveries;
