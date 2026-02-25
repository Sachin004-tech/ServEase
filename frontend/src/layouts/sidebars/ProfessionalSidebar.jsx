import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdBookOnline,
    MdMiscellaneousServices,
    MdChevronRight,
    MdMenu,
    MdClose,
} from "react-icons/md";

const ProfessionalSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {
            name: "Dashboard",
            path: "/professionaldashboard",
            icon: MdDashboard,
        },
        {
            name: "KYC",
            path: "/professionaldashboard/kyc",
            icon: MdDashboard,
        },
        {
            name: "My Booking",
            path: "/professionaldashboard/bookings",
            icon: MdBookOnline,
        },
        {
            name: "Add Services",
            path: "/professionaldashboard/services",
            icon: MdMiscellaneousServices,
        },
        {
            name: "Manage Services",
            path: "/professionaldashboard/manage-services",
            icon: MdMiscellaneousServices,
        },
    ];

    return (
        <>
            {/* Hamburger button – visible only on small screens */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-[18px] left-4 z-50 rounded-md p-1 text-gray-700 hover:bg-gray-100 lg:hidden"
                aria-label="Open sidebar"
            >
                <MdMenu size={26} />
            </button>

            {/* Backdrop – small screens only */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64
                    border-r border-gray-200 bg-white p-4 shadow-sm
                    transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                {/* Close button inside sidebar – small screens only */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="mb-3 flex items-center justify-end w-full text-gray-500 hover:text-gray-800 lg:hidden"
                    aria-label="Close sidebar"
                >
                    <MdClose size={22} />
                </button>

                <div className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={22} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <MdChevronRight
                                size={18}
                                className="opacity-0 transition-opacity NavLink-active:opacity-100"
                            />
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default ProfessionalSidebar;
