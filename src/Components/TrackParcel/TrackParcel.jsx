import React, { useState } from "react";
import Useaxios from "../../Hooks/Useaxios";


const TrackParcel = () => {
  const axiosInstance=Useaxios();
  const [trackingId, setTrackingId] = useState("");
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.get(`/trackings/${trackingId}`);
      if (res.data.length === 0) {
        setError("No tracking updates found.");
        setUpdates([]);
      } else {
        setUpdates(res.data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching tracking data.");
    }
  };


//  const res= await axiosInstance.post("/trackings", {
//   tracking_id: "TRK123456",
//   status: "Arrived at destination",
//   location: "Chittagong",
//   updated_by: currentuser?.email, // or currentuser?.userName
// });









  return (
   <div className="max-w-2xl mx-auto mt-10 px-4">
  <h2 className="text-3xl font-bold mb-6 text-center">Track Your Parcel</h2>

  <div className="flex gap-2 mb-6">
    <input
      type="text"
      placeholder="Enter Tracking ID"
      value={trackingId}
      onChange={(e) => setTrackingId(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none"
    />
    <button
      onClick={handleSearch}
      className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
    >
      Search
    </button>
  </div>

  {error && <p className="text-red-500 text-center">{error}</p>}

  {updates.length > 0 && (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Tracking ID: {trackingId}
      </h3>
      <ul className="timeline timeline-vertical">
        {updates.map((item, index) => (
          <li key={index}>
            <div className="timeline-start">{new Date(item.timestamp).toLocaleDateString()}</div>
            <div className="timeline-middle bg-blue-600 text-white rounded-full w-4 h-4"></div>
            <div className="timeline-end mb-10">
              <div className="text-lg font-semibold">{item.status}</div>
              <div className="text-sm text-gray-600">{item.location}</div>
              {item.updated_by && (
                <div className="text-xs text-gray-400 italic">Updated by: {item.updated_by}</div>
              )}
              <div className="text-xs text-gray-400">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
};

export default TrackParcel;
