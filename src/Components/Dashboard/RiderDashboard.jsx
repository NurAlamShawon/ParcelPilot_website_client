import React from "react";
import { Link } from "react-router";

const RiderDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Banner */}
      <div className="relative h-48 rounded-xl overflow-hidden shadow">
        <img
          src="https://images.unsplash.com/photo-1549921296-3a6b59c09b30"
          alt="Dashboard"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h2 className="text-white text-3xl text-center font-bold">
            Welcome to ParcelPilot Dashboard
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/dashboard/pending-deliveries"
          className="btn btn-primary w-full h-28 text-lg shadow"
        >
          📦 Pending Parcels
        </Link>

        <Link
          to="/dashboard/completed-deliveries"
          className="btn btn-success w-full h-28 text-lg shadow"
        >
          ✅ Completed Deliveries
        </Link>

        <Link
          to="/dashboard/earning-summary"
          className="btn btn-warning w-full h-28 text-lg shadow"
        >
          💰 My Earnings
        </Link>
      </div>
    </div>
  );
};

export default RiderDashboard;
