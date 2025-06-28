import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import SecondSection from "../Components/SecondSection/SecondSection";
import ThirdSection from "../Components/ThirdSection/ThirdSection";
import FourthSection from "../Components/FourthSection/FourthSection";
import FifthSection from "../Components/FifthSection/FifthSection";
import MerchantSection from "../Components/Merchant/MerchantSection";
import CustomerReview from "../Components/CustomerReview/CustomerReview";
import Faq from "../Components/Faq/Faq";

const Home = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <SecondSection></SecondSection>
      <ThirdSection></ThirdSection>
      <FourthSection></FourthSection>
      <FifthSection></FifthSection>
      <MerchantSection></MerchantSection>
      <CustomerReview></CustomerReview>
      <Faq></Faq>
    </div>
  );
};

export default Home;
