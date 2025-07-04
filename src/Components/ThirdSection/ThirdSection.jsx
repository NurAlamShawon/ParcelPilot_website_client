import { useEffect, useState } from "react";
import { PackageCheck } from "lucide-react";

const ThirdSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/ThirdSectionCard.json")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error loading services:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-[#03373D] rounded-2xl py-10 my-20">
      <section className=" py-12 px-4 min-h-screen rancho">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-white">Our Services</h1>
          <p className="text-[#DADADA] text-lg max-w-2xl mx-auto">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((item, index) => (
            <div
              key={index}
              className=" rounded-2xl shadow-md p-12 text-center flex flex-col items-center hover:shadow-xl transition-shadow"
              style={{ backgroundColor: item.color }}
            >
              <PackageCheck className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-gray-600 text-xl font-semibold mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ThirdSection;
