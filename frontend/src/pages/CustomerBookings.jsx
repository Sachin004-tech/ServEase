import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking, bookingDetails, contactProfessional as fetchProDetails, bookingProgress as fetchBookingProgress } from '../api/auth';
import { toast } from 'react-toastify';

import BookingHeader from '../components/booking/BookingHeader';
import BookingCard from '../components/booking/BookingCard';
import EmptyBookings from '../components/booking/EmptyBookings';
import BookingDetailsModal from '../components/booking/BookingDetailsModal';
import ProfessionalModal from '../components/booking/ProfessionalModal';

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    // Pro Modal State
    const [professionalData, setProfessionalData] = useState(null);
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const [proModalLoading, setProModalLoading] = useState(false);

    const fetchBookings = async () => {
        try {
            const response = await getMyBookings();
            if (response.success) {
                setBookings(response.bookings || []);
            } else {
                toast.error(response.message || "Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error(error.response?.data?.message || "Something went wrong while fetching bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const response = await cancelBooking(bookingId);
            toast.success(response.message || "Booking cancelled successfully");
            fetchBookings();
        } catch (error) {
            console.error("Error cancelling booking:", error);
            toast.error(error.response?.data?.message || "Something went wrong while cancelling the booking");
        }
    };

    const handleViewDetails = async (bookingId) => {
        setIsModalOpen(true);
        setModalLoading(true);
        try {
            const response = await bookingDetails(bookingId);
            if (response.success) {
                setSelectedBooking(response.booking);
                console.log("Booking Details:", response.booking);

                try {
                    await fetchBookingProgress(bookingId);
                } catch (err) {
                    console.error("Error fetching progress:", err);
                }
            } else {
                toast.error(response.message || "Failed to fetch details");
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to load booking details");
            setIsModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleContactProfessional = async (bookingId) => {
        setIsProModalOpen(true);
        setProModalLoading(true);
        try {
            const response = await fetchProDetails(bookingId);
            if (response.success) {
                setProfessionalData(response);
                console.log("Professional Data:", professionalData);
            } else {
                toast.error(response.message || "Failed to fetch professional details");
                setIsProModalOpen(false);
            }
        } catch (error) {
            console.error("Error contacting professional:", error);
            toast.error(error.response?.data?.message || "Something went wrong while contacting the professional");
            setIsProModalOpen(false);
        } finally {
            setProModalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <BookingHeader />

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary border-t-transparent"></div>
                        <p className="text-gray-400 font-bold animate-pulse">Loading your bookings...</p>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.booking_id}
                                booking={booking}
                                onContact={handleContactProfessional}
                                onViewDetails={handleViewDetails}
                                onCancel={handleCancel}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyBookings />
                )}
            </div>

            <BookingDetailsModal
                isOpen={isModalOpen}
                loading={modalLoading}
                booking={selectedBooking}
                onClose={() => setIsModalOpen(false)}
            />

            <ProfessionalModal
                isOpen={isProModalOpen}
                loading={proModalLoading}
                professional={professionalData}
                onClose={() => setIsProModalOpen(false)}
            />
        </div>
    );
};

export default CustomerBookings;
