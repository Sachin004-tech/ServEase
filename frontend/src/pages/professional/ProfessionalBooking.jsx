import React, { useState, useEffect } from "react";
import ProfessionalSidebar from "../../layouts/sidebars/ProfessionalSidebar";
import { ProfessionalBookingRequests, acceptBookingRequest, rejectBookingRequest, professionalBookingDetails, liveStatus } from "../../api/auth";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { LuCalendar, LuUser, LuClock, LuTruck } from "react-icons/lu";
import { MdMoreVert, MdCheckCircle, MdCancel, MdInfo, MdPhone, MdBadge, MdAccessTime, MdUpdate } from "react-icons/md";
import Modal from "../../components/modal/Modal";

const ProfessionalBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Live Status Modal State
    const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
    const [selectedLiveBooking, setSelectedLiveBooking] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await ProfessionalBookingRequests();
            setBookings(data || []);

            if (!data || data.length === 0) {
                setBookings([
                    {
                        "booking_id": 1,
                        "customer_name": "Rahul",
                        "service_name": "AC Repair",
                        "status": "pending",
                        "date": "2024-03-20"
                    }
                ]);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
            setBookings([
                {
                    "booking_id": 1,
                    "customer_name": "Rahul",
                    "service_name": "AC Repair",
                    "status": "pending",
                    "date": "2024-03-20"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const handleAccept = async (bookingId) => {
        try {
            const response = await acceptBookingRequest(bookingId);
            toast.success(response.message || "Booking accepted successfully!");
            setActiveDropdown(null);
            fetchBookings();
        } catch (error) {
            console.error("Error accepting booking:", error);
            toast.error(error.response?.data?.message || "Failed to accept booking");
        }
    };

    const handleReject = async (bookingId) => {
        try {
            const response = await rejectBookingRequest(bookingId);
            toast.success(response.message || "Booking rejected successfully!");
            setActiveDropdown(null);
            fetchBookings();
        } catch (error) {
            console.error("Error rejecting booking:", error);
            toast.error(error.response?.data?.message || "Failed to reject booking");
        }
    };

    const handleBookingDetails = async (bookingId) => {
        try {
            setModalLoading(true);
            setIsModalOpen(true);
            setActiveDropdown(null);
            const data = await professionalBookingDetails(bookingId);
            setSelectedBooking(data);
        } catch (error) {
            console.error("Error fetching booking details:", error);
            toast.error(error.response?.data?.message || "Failed to load booking details");
            // Fallback dummy data as requested
            setSelectedBooking({
                "booking_id": bookingId,
                "status": "pending",
                "customer_name": "Amit",
                "phone": "9876543210"
            });
        } finally {
            setModalLoading(false);
        }
    };

    const handleLiveStatusOpen = (booking) => {
        setSelectedLiveBooking(booking);
        setIsLiveModalOpen(true);
        setActiveDropdown(null);
    };

    const handleUpdateLiveStatus = async (bookingId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const response = await liveStatus(bookingId, newStatus);
            toast.success(response.message || `Status updated to ${newStatus.replace(/_/g, ' ')}`);
            setIsLiveModalOpen(false);
            fetchBookings(); // Refresh the list
        } catch (error) {
            console.error("Error updating live status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const allowedStatuses = [
        { id: "on_the_way", label: "On The Way", icon: LuTruck, color: "text-blue-500", bg: "bg-blue-50" },
        { id: "arrived", label: "Arrived", icon: LuTruck, color: "text-indigo-500", bg: "bg-indigo-50" },
        { id: "work_started", label: "Work Started", icon: LuTruck, color: "text-amber-500", bg: "bg-amber-50" },
        { id: "completed", label: "Completed", icon: MdCheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: "failed", label: "Failed", icon: LuTruck, color: "text-rose-500", bg: "bg-rose-50" },
        { id: "cancelled", label: "Cancelled", icon: MdCancel, color: "text-gray-500", bg: "bg-gray-50" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <ProfessionalSidebar />
            <main className="flex-1 p-8 pl-14 lg:pl-8 lg:ml-64 mt-16">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Booking Requests</h1>
                        <p className="text-gray-500 mt-2">Manage and respond to your incoming service bookings.</p>
                    </header>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <AnimatePresence>
                                            {bookings.map((booking) => (
                                                <motion.tr
                                                    key={booking.booking_id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium text-gray-900">#{booking.booking_id}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                                <LuUser size={16} />
                                                            </div>
                                                            <span className="text-sm text-gray-700 font-medium">{booking.customer_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">{booking.service_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                            booking.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                                'bg-rose-50 text-rose-700 border border-rose-100'
                                                            }`}>
                                                            {booking.status || 'pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                                        <button
                                                            id={`dropdown-btn-${booking.booking_id}`}
                                                            onClick={() => toggleDropdown(booking.booking_id)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                                                        >
                                                            <MdMoreVert size={20} />
                                                        </button>

                                                        {activeDropdown === booking.booking_id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                ></div>
                                                                <div className="absolute right-6 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden">
                                                                    <button
                                                                        className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors"
                                                                        onClick={() => handleAccept(booking.booking_id)}
                                                                    >
                                                                        <MdCheckCircle size={18} className="text-emerald-600" />
                                                                        Accept Request
                                                                    </button>
                                                                    <button
                                                                        className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-rose-50 text-gray-700 hover:text-rose-700 transition-colors"
                                                                        onClick={() => handleReject(booking.booking_id)}
                                                                    >
                                                                        <MdCancel size={18} className="text-rose-600" />
                                                                        Reject Request
                                                                    </button>
                                                                    <button
                                                                        className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
                                                                        onClick={() => handleBookingDetails(booking.booking_id)}
                                                                    >
                                                                        <MdInfo size={18} className="text-blue-600" />
                                                                        Booking Details
                                                                    </button>
                                                                    <button
                                                                        className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors"
                                                                        onClick={() => handleLiveStatusOpen(booking)}
                                                                    >
                                                                        <MdUpdate size={18} className="text-amber-600" />
                                                                        Change Live Status
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                            {bookings.length === 0 && (
                                <div className="p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-300 mb-4">
                                        <LuCalendar size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No booking requests</h3>
                                    <p className="text-gray-500 mt-1">You don't have any incoming service requests at the moment.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Booking Details"
                        size="md"
                    >
                        {modalLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : selectedBooking ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                            <MdBadge size={16} />
                                            <span>Booking ID</span>
                                        </div>
                                        <div className="text-lg font-bold text-white">#{selectedBooking.booking_id}</div>
                                    </div>
                                    <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                            <MdAccessTime size={16} />
                                            <span>Status</span>
                                        </div>
                                        <div className="capitalize text-lg font-bold text-amber-400">{selectedBooking.status}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <LuUser size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Customer Name</div>
                                            <div className="text-lg font-medium text-white">{selectedBooking.customer_name}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                            <MdPhone size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Phone Number</div>
                                            <div className="text-lg font-medium text-white">{selectedBooking.phone || "Not provided"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                Failed to load details.
                            </div>
                        )}
                    </Modal>

                    {/* Live Status Update Modal */}
                    <Modal
                        isOpen={isLiveModalOpen}
                        onClose={() => setIsLiveModalOpen(false)}
                        title="Update Live Status"
                        size="md"
                    >
                        <div className="space-y-4">
                            <p className="text-gray-400 text-sm mb-4">
                                Update the current progress of the service for booking <span className="text-white font-medium">#{selectedLiveBooking?.booking_id}</span>.
                            </p>

                            <div className="grid grid-cols-1 gap-3">
                                {allowedStatuses.map((status) => {
                                    const Icon = status.icon;
                                    const isCurrent = selectedLiveBooking?.live_status === status.id;

                                    return (
                                        <button
                                            key={status.id}
                                            disabled={updatingStatus || isCurrent}
                                            onClick={() => handleUpdateLiveStatus(selectedLiveBooking.booking_id, status.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${isCurrent
                                                ? 'bg-primary-600/20 border-primary-500 text-white cursor-default'
                                                : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                                                } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${status.bg} ${status.color}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <span className="font-medium">{status.label}</span>
                                            </div>
                                            {isCurrent && (
                                                <div className="bg-primary-500 text-white rounded-full p-1">
                                                    <MdCheckCircle size={16} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={() => setIsLiveModalOpen(false)}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </main>
        </div>
    );
};

export default ProfessionalBookings;
