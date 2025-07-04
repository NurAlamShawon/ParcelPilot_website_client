import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";


const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const axiosInstance = useAxiosSecure();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/overview");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, [axiosInstance]);

  if (!stats) {
    return <p className="text-center mt-10">Loading stats...</p>;
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
        📦 Admin Dashboard Overview
      </h2>
      <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
        Real-time insights into deliveries, users, and rider activity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Parcels */}
        <div className="stats shadow bg-blue-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              {/* Parcel Icon: Cube */}
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
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0v8m0-8l-8 4m0 8v-8m0 8l-8-4m0-8v8m0-8l8 4"
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
              {/* Check Circle Icon */}
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
                  strokeWidth={2}
                  d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
              {/* Users Icon */}
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
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8zm6 8H6"
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
              {/* Truck Icon (Delivery vehicle) */}
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
                  strokeWidth={2}
                  d="M9 17a2 2 0 100 4 2 2 0 000-4zm6 2h2a2 2 0 002-2v-5a1 1 0 00-1-1h-5V5a1 1 0 00-1-1H4a1 1 0 00-1 1v10h2a2 2 0 100 4 2 2 0 100-4h10zm2-2h2v2h-2v-2z"
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
              {/* Exclamation Icon */}
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
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
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
