import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/UseaxiosSecure";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/admin/overview");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, [axiosSecure]);

  if (!stats) {
    return <p className="text-center mt-10">Loading stats...</p>;
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
        📦 Admin Dashboard Overview
      </h2>
      <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
        Real-time insights into parcels, users, and riders — all in one place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Parcels */}
        <div className="stats shadow bg-blue-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h18v6H3V3zm0 8h18v10H3V11z"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Total Parcels</div>
            <div className="stat-value">{stats.totalParcels}</div>
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="stats shadow bg-green-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2l4-4m-6 4V4m0 16h6"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Completed Deliveries</div>
            <div className="stat-value">{stats.completedDeliveries}</div>
          </div>
        </div>

        {/* Total Users */}
        <div className="stats shadow bg-cyan-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A9.002 9.002 0 0112 3v0a9 9 0 017.879 14.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
        </div>

        {/* Total Riders */}
        <div className="stats shadow bg-purple-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Total Riders</div>
            <div className="stat-value">{stats.totalRiders}</div>
          </div>
        </div>

        {/* Pending Riders */}
        <div className="stats shadow bg-yellow-500 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M1 1l22 22"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Pending Riders</div>
            <div className="stat-value">{stats.pendingRiders}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
