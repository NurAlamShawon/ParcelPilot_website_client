import React from "react";

const UserDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="relative h-48 rounded-xl overflow-hidden shadow">
        <img
          src="https://images.unsplash.com/photo-1581091012184-4c2a3e86d2fd"
          alt="User Dashboard"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-3xl text-center font-bold">Welcome Back! Your Parcels Are on the Move</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-100 rounded-xl p-6 shadow text-center">
          <h3 className="text-xl font-bold text-blue-700 mb-2">Create a New Parcel</h3>
          <p className="text-gray-700">Send anything to anywhere in minutes.</p>
          <button className="btn btn-primary btn-sm mt-4">Create Now</button>
        </div>

        <div className="bg-green-100 rounded-xl p-6 shadow text-center">
          <h3 className="text-xl font-bold text-green-700 mb-2">Track Your Deliveries</h3>
          <p className="text-gray-700">Stay updated with real-time parcel tracking.</p>
          <button className="btn btn-success btn-sm mt-4">Track Parcels</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
