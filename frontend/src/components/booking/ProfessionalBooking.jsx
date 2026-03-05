import React from "react";
import ProfessionalSidebar from "../../layouts/sidebars/ProfessionalSidebar";

const ProfessionalBookings = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <ProfessionalSidebar />
            <main className="flex-1 p-8 lg:ml-64 mt-16">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
                    <p className="text-gray-600">View and manage your service bookings here.</p>
                </div>
            </main>
        </div>
    );
};

export default ProfessionalBookings;