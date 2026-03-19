import React, { useEffect, useState } from "react";
import HomeLeftBar from "../components/home/HomeLeftBar";
import HomeBottomContent from "../components/home/HomeBottomContent";
import HomeBottomContent2 from "../components/home/HomeBottomContent2";
import HomeRightContent from "../components/home/HomeRightContent";
import Footer from "../components/footer/Footer";
import { getServices } from "../api/auth";

// Category Specific Components
import CleaningContent from "../components/home/categories/CleaningContent";
import PlumbingContent from "../components/home/categories/PlumbingContent";
import ElectricianContent from "../components/home/categories/ElectricianContent";
import PestControlContent from "../components/home/categories/PestControlContent";
import SalonWomenContent from "../components/home/categories/SalonWomenContent";
import SalonMenContent from "../components/home/categories/SalonMenContent";
import ACRepairContent from "../components/home/categories/ACRepairContent";
import ApplianceRepairContent from "../components/home/categories/ApplianceRepairContent";
import PaintingContent from "../components/home/categories/PaintingContent";
import HomeSkeleton from "../components/home/HomeSkeleton";

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        console.log(response);
        setServices(response);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Section: Sidebar and Banner */}
      <div className="flex flex-col md:flex-row flex-1 justify-center items-start gap-20 p-4 md:p-12 max-w-[1400px] mx-auto w-full">
        {/* Services and Heading (Left Side) */}
        <HomeLeftBar />

        {/* Banner Image (Right Side) */}
        <HomeRightContent />
      </div>

      {/* Hero Section 1: In the Spotlight */}
      <HomeBottomContent />

      {/* Hero Section 2: Most Booked Services */}
      <HomeBottomContent2 services={services} />

      {/* Category Specific Sections */}
      <CleaningContent services={services} />
      <PlumbingContent services={services} />
      <ElectricianContent services={services} />
      <PestControlContent services={services} />
      <SalonWomenContent services={services} />
      <SalonMenContent services={services} />
      <ACRepairContent services={services} />
      <ApplianceRepairContent services={services} />
      <PaintingContent services={services} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
