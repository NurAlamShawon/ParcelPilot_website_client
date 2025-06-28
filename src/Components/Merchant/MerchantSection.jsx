import React from "react";

const MerchantSection = () => {
  return (
    <div className="max-w-7xl my-30 mx-auto bg-[#03373D] p-4 xl:p-10 rounded-2xl bg-no-repeat bg-[url('https://i.postimg.cc/MGdH2wgg/be-a-merchant-bg.png')]">
      <div className="xl:flex flex-col items-center">
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-white">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="text-base text-[#DADADA]">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. ParcelPilot courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div>
            <button className="btn rounded-2xl mr-2 bg-[#CAEB66] text-black">
              Become a Merchant
            </button>
            <button className="btn rounded-2xl bg-transparent border-2 border-[#CAEB66] text-[#CAEB66]">
              Earn with Profast Courier
            </button>
          </div>
        </div>
        <img src="https://i.postimg.cc/Gpct5tgk/location-merchant.png" alt="" className="xl:mt-0 mt-2" />
      </div>
    </div>
  );
};

export default MerchantSection;
