import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure Leaflet icon manually
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Coverage = () => {
  const [coverageData, setCoverageData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchCoverage = async () => {
      const res = await fetch("/Coverage.json"); // ✅ must be in /public
      const data = await res.json();
      setCoverageData(data);
      setFilteredData(data); // ✅ initial data
    };
    fetchCoverage();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = coverageData.filter((item) => {
      return (
        item.city.toLowerCase().includes(term) ||
        item.district.toLowerCase().includes(term) ||
        item.covered_area.some((area) => area.toLowerCase().includes(term))
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, coverageData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#03464D]">
        Our Delivery Coverage
      </h2>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search city, district, or area"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredData.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <strong>{location.city}, {location.district}</strong>
              <br />
              Region: {location.region}
              <br />
              Covered: {location.covered_area.join(", ")}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Coverage;
