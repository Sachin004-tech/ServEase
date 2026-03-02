import React from "react";
import ProfessionalSidebar from "../../layouts/sidebars/ProfessionalSidebar";

const Kyc = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <ProfessionalSidebar />
            <main className="flex-1 p-8 lg:ml-64 mt-16">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">KYC Verification</h1>
                    <p className="text-gray-600">Please complete your KYC verification to start providing services.</p>
                </div>
            </main>
        </div>
    );
};

export default Kyc;