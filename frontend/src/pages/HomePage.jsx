import React from "react";
import HomeLeftBar from "../components/home/HomeLeftBar";
import HomeBottomContent from "../components/home/HomeBottomContent";
import HomeBottomContent2 from "../components/home/HomeBottomContent2";
import HomeBottomContent3 from "../components/home/HomeBottomContent3";
import HomeRightContent from "../components/home/HomeRightContent";
import Footer from "../components/footer/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Section: Sidebar and Banner */}
      <div className="flex flex-col md:flex-row flex-1 justify-center items-start gap-20 p-4 md:p-12 max-w-[1400px] mx-auto w-full">
        {/* Services and Heading (Left Side) */}
        <HomeLeftBar />

        {/* Banner Image (Right Side) */}
        <HomeRightContent />
      </div>

      {/* Bottom Section 1 */}
      <HomeBottomContent />

      {/* Bottom Section 2 */}
      <HomeBottomContent2 />

      {/* Bottom Section 3 */}
      <HomeBottomContent3 />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
