import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import Navbar from "../Components/Navbar/Navbar";

const LandingPage = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <HeroSection />
    </div>
  );
};

export default LandingPage;
