import React from "react";
import ProfessionalSidebar from "../../layouts/sidebars/ProfessionalSidebar";

const ProfessionalDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <ProfessionalSidebar />
                <main className="flex-1 p-8 pl-14 lg:pl-8 lg:ml-64 mt-16">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold text-gray-800">Professional Dashboard</h1>
                        <p className="text-gray-600">Welcome back to your professional dashboard.</p>

                        {/* Dashboard Content will go here */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {/* Example placeholder cards */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32 flex items-center justify-center text-gray-400 border-dashed italic">
                                Summary Stats Placeholder
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32 flex items-center justify-center text-gray-400 border-dashed italic">
                                Recent Bookings Placeholder
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32 flex items-center justify-center text-gray-400 border-dashed italic">
                                Active Services Placeholder
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfessionalDashboard;
