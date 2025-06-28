import React, { useEffect, useState } from "react";

const CARD_WIDTH = 350;
const GAP = 16; // px (Tailwind's gap-4)

const CustomerReview = () => {
  const [testimonials, settestimonials] = useState([]);

  useEffect(() => {
    const fetchreview = async () => {
      const res = await fetch("/Review.json");
      const data = await res.json();
      console.log(data)
      settestimonials(data);
    };
    fetchreview();
  }, []);

  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const prevTestimonial = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const nextTestimonial = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  // Generate visible cards dynamically: center card + 2 before + 2 after
  const getVisibleCards = () => {
    const visible = [];
    for (let offset = -2; offset <= 2; offset++) {
      const index = (current + offset + total) % total;
      visible.push({
        ...testimonials[index],
        relative: offset,
        key: `${index}-${offset}`,
      });
    }
    return visible;
  };

  return (
    <div>
      <div className="space-y-5">
        <img
          src="https://i.postimg.cc/TPBVjgTY/live-tracking.png"
          alt=""
          className="mx-auto"
        />
        <h1 className="text-[#03373D] text-center text-3xl font-extrabold">
          What our customers are sayings
        </h1>
        <p className="text-[#606060] text-center text-base">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>

      <div className="relative w-full flex flex-col items-center overflow-hidden my-20">
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(calc(50% - ${CARD_WIDTH / 2}px - ${
                (CARD_WIDTH + GAP) * 2
              }px))`,
            }}
          >
            {getVisibleCards().map((testimonial) => {
              const { relative, key } = testimonial;

              let scale = "scale-90";
              let blur = "blur-sm";
              let opacity = "opacity-30";
              let z = "z-0";

              if (relative === 0) {
                scale = "scale-100";
                blur = "blur-0";
                opacity = "opacity-100";
                z = "z-20";
              } else if (Math.abs(relative) === 1) {
                scale = "scale-95";
                blur = "blur-sm";
                opacity = "opacity-60";
                z = "z-10";
              }

              return (
                <div
                  key={key}
                  className={`w-[${CARD_WIDTH}px] shrink-0 transition-all duration-300 ease-in-out transform ${scale} ${blur} ${opacity} ${z}`}
                >
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <img src="https://i.postimg.cc/BZ8zKgZK/review-Quote.png" alt="" />
                    <p className="text-gray-700 text-base italic mb-4">
                      “{testimonial.message}”
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                        {testimonial.name}
                      </div>
                      <div>
                        <h4 className="text-md font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={prevTestimonial}
            className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 text-white flex items-center justify-center transition"
          >
            ←
          </button>

          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                current === index ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          ))}

          <button
            onClick={nextTestimonial}
            className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;
