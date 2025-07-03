import React, { useContext } from "react";
import { ValueContext } from "../../Context/ValueContext";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";
import { useQuery } from "@tanstack/react-query";

const RiderEarningsSummary = () => {
  const { currentuser } = useContext(ValueContext);
  const axiosInstance = useAxiosSecure();

  const { data: summary, isLoading } = useQuery({
    queryKey: ["rider-earnings-summary", currentuser.email],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/riders/summary?email=${currentuser.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading earnings summary...</p>;
  if (!summary) return <p className="text-center text-red-500">Could not load earnings summary.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Earnings Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Earned */}
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow text-center">
          <div className="text-3xl font-bold text-green-700 mb-1">
            ৳{summary.totalEarned.toFixed(2)}
          </div>
          <div className="text-sm font-medium text-gray-700">Total Earned</div>
        </div>

        {/* Total Cashed Out */}
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded shadow text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">
            ৳{summary.totalCashout.toFixed(2)}
          </div>
          <div className="text-sm font-medium text-gray-700">Total Cashed Out</div>
        </div>

        {/* Current Balance */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            ৳{summary.currentBalance.toFixed(2)}
          </div>
          <div className="text-sm font-medium text-gray-700">Current Balance</div>
        </div>
      </div>
    </div>
  );
};

export default RiderEarningsSummary;
