import React from "react";

const RiderDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="relative h-48 rounded-xl overflow-hidden shadow">
        <img
          src="https://images.unsplash.com/photo-1598514982846-d4497f72c112"
          alt="Rider Dashboard"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-3xl text-center font-bold">Ride On, Deliver Fast, Earn More</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Completed</h3>
          <p className="text-4xl font-bold mt-2">58</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Earnings</h3>
          <p className="text-4xl font-bold mt-2">৳2,300</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Pending</h3>
          <p className="text-4xl font-bold mt-2">4</p>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
