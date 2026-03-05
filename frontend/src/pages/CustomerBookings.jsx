import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking, bookingDetails, contactProfessional as fetchProDetails, bookingProgress as fetchBookingProgress } from '../api/auth';
import { toast } from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

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

    // Live Progress State
    const [progressData, setProgressData] = useState(null);
    const [progressLoading, setProgressLoading] = useState(false);

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
        setProgressLoading(true);
        try {
            // Fetch basic details
            const response = await bookingDetails(bookingId);
            if (response.success) {
                setSelectedBooking(response.booking);

                // Fetch progress details if booking is active
                try {
                    const progressResponse = await fetchBookingProgress(bookingId);
                    if (progressResponse.success) {
                        setProgressData(progressResponse.progress);
                    }
                } catch (err) {
                    console.error("Error fetching progress:", err);
                    // Don't close modal, progress is secondary
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
            setProgressLoading(false);
        }
    };

    const handleContactProfessional = async (bookingId) => {
        setIsProModalOpen(true);
        setProModalLoading(true);
        try {
            const response = await fetchProDetails(bookingId);
            if (response.success) {
                setProfessionalData(response.professional);
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

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'completed':
            case 'accepted':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'pending':
            case 'assigned':
                return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'on_the_way':
            case 'started':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const LiveProgressStepper = ({ currentStatus }) => {
        const stages = [
            { id: 'accepted', label: 'Accepted', icon: '✔' },
            { id: 'on_the_way', label: 'Professional On The Way', icon: '🚗' },
            { id: 'started', label: 'Service Started', icon: '🔧' },
            { id: 'completed', label: 'Completed', icon: '✅' }
        ];

        const getStatusIndex = (status) => {
            const s = status?.toLowerCase();
            if (s === 'accepted' || s === 'assigned' || s === 'confirmed') return 0;
            if (s === 'on_the_way') return 1;
            if (s === 'started') return 2;
            if (s === 'completed') return 3;
            return -1;
        };

        const currentStep = getStatusIndex(currentStatus);

        return (
            <div className="mt-8 mb-10">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Live Progress</h4>
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100 z-0"></div>
                    <div
                        className="absolute left-[19px] top-0 w-0.5 bg-primary z-0 transition-all duration-1000 ease-in-out"
                        style={{ height: `${Math.max(0, currentStep * 33.33)}%` }}
                    ></div>

                    <div className="space-y-8 relative z-10">
                        {stages.map((stage, index) => {
                            const isCompleted = index <= currentStep;
                            const isActive = index === currentStep;

                            return (
                                <div key={stage.id} className="flex items-center gap-4 group">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500
                                        ${isCompleted ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'}
                                        ${isActive ? 'ring-4 ring-primary/20 animate-pulse' : ''}
                                    `}>
                                        {stage.icon}
                                    </div>
                                    <div>
                                        <p className={`font-black text-sm uppercase tracking-tight transition-colors duration-500
                                            ${isCompleted ? 'text-gray-900' : 'text-gray-300'}
                                            ${isActive ? 'text-primary scale-105 origin-left' : ''}
                                        `}>
                                            {stage.label}
                                        </p>
                                        {isActive && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-primary animate-bounce mt-1">
                                                <div className="w-1 h-1 rounded-full bg-primary"></div>
                                                Current Status
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Bookings</h1>
                        <p className="text-gray-500 mt-2 text-lg font-medium">Manage your professional service appointments</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary border-t-transparent"></div>
                        <p className="text-gray-400 font-bold animate-pulse">Loading your bookings...</p>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookings.map((booking) => (
                            <div key={booking.booking_id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: #{booking.booking_id}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{booking.created_at}</p>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                                {booking.service_name || "Professional Service"}
                                            </h3>
                                            <p className="text-gray-500 font-bold mt-1">Pro: {booking.professional_name || "Assigned Soon"}</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(booking.status)}`}>
                                                    Status: {booking.status}
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(booking.live_status)}`}>
                                                    Live: {booking.live_status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <CalendarTodayIcon className="text-primary" sx={{ fontSize: 24 }} />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Appointment Date</p>
                                                <p className="font-bold text-gray-900">{booking.booking_date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <AccessTimeIcon className="text-primary" sx={{ fontSize: 24 }} />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</p>
                                                <p className="font-bold text-gray-900">{booking.booking_time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</p>
                                                <p className="text-2xl font-black text-primary">₹{booking.amount}</p>
                                            </div>
                                            {booking.status?.toLowerCase() === 'confirmed' || booking.status?.toLowerCase() === 'paid' ? (
                                                <div className="flex items-center gap-2 text-green-600 font-bold">
                                                    <CheckCircleOutlineIcon fontSize="small" />
                                                    <span className="text-sm">Paid</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-400 font-bold">
                                                    <ErrorOutlineIcon fontSize="small" />
                                                    <span className="text-sm uppercase tracking-tighter">Pay on Service</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleContactProfessional(booking.booking_id)}
                                                className="flex-1 py-3 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary-hover transition-all active:scale-95 shadow-md"
                                            >
                                                Contact
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(booking.booking_id)}
                                                className="flex-1 py-3 rounded-2xl bg-gray-900 text-white font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => handleCancel(booking.booking_id)}
                                                className="flex-1 py-3 rounded-2xl border-2 border-red-100 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] p-16 text-center shadow-sm border border-gray-100">
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl">
                            📭
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">No bookings yet</h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto">
                            You haven't booked any services yet. Our professionals are ready to help you!
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                        >
                            Explore Services
                        </button>
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl transition-all border border-gray-100 animate-in fade-in zoom-in duration-300">
                        {modalLoading ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                                <p className="text-gray-400 font-bold">Loading Details...</p>
                            </div>
                        ) : selectedBooking ? (
                            <div>
                                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Booking Details</h2>
                                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">ID: #{selectedBooking.booking_id}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            {/* Stepper Integration */}
                                            <LiveProgressStepper currentStatus={selectedBooking.live_status || selectedBooking.status} />

                                            <section>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Service Details</h4>
                                                <p className="text-xl font-black text-gray-900">{selectedBooking.service_name}</p>
                                                <p className="text-primary font-bold text-2xl mt-1">₹{selectedBooking.amount}</p>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Professional</h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">👤</div>
                                                    <p className="font-bold text-gray-900">{selectedBooking.professional_name || "Assigning Professional..."}</p>
                                                </div>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Booking Status</h4>
                                                <div className="flex flex-col gap-2">
                                                    <span className={`px-4 py-2 rounded-xl text-center text-xs font-black uppercase tracking-tighter border ${getStatusStyle(selectedBooking.status)}`}>
                                                        Order Status: {selectedBooking.status}
                                                    </span>
                                                    <span className={`px-4 py-2 rounded-xl text-center text-xs font-black uppercase tracking-tighter border ${getStatusStyle(selectedBooking.live_status)}`}>
                                                        Live Status: {selectedBooking.live_status}
                                                    </span>
                                                </div>
                                            </section>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <CalendarTodayIcon className="text-primary" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Date</p>
                                                        <p className="font-bold text-gray-900">{selectedBooking.booking_date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <AccessTimeIcon className="text-primary" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Time</p>
                                                        <p className="font-bold text-gray-900">{selectedBooking.booking_time}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <section>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Metadata</h4>
                                                <div className="text-xs space-y-1 font-medium text-gray-500">
                                                    <p>Booked on: {selectedBooking.created_at}</p>
                                                    <p>Booking ID Reference: #{selectedBooking.booking_id}</p>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex justify-end">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 font-bold">Failed to load booking details.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Professional Details Modal */}
            {isProModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                        onClick={() => setIsProModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl transition-all border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-500">
                        {proModalLoading ? (
                            <div className="p-24 text-center space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
                                <p className="text-gray-400 font-bold animate-pulse">Connecting to Professional...</p>
                            </div>
                        ) : professionalData ? (
                            <div className="flex flex-col">
                                {/* Header / Profile Section */}
                                <div className="relative h-32 bg-primary/10 flex items-center justify-center">
                                    <div className="absolute -bottom-12 w-24 h-24 rounded-[32px] bg-white border-4 border-white shadow-xl flex items-center justify-center text-4xl overflow-hidden">
                                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary font-black">
                                            {professionalData.name?.charAt(0)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsProModalOpen(false)}
                                        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/50 flex items-center justify-center text-gray-700 hover:bg-white transition-all shadow-sm"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="px-8 pt-16 pb-10 text-center">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{professionalData.name}</h2>
                                    <p className="text-primary font-bold flex items-center justify-center gap-1 mt-1 lowercase">
                                        <BadgeIcon sx={{ fontSize: 16 }} />
                                        {professionalData.skill || 'Expert Professional'}
                                    </p>

                                    <div className="mt-8 flex justify-center gap-2">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(professionalData.status)}`}>
                                            Status: {professionalData.status}
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(professionalData.live_status)}`}>
                                            Live: {professionalData.live_status}
                                        </span>
                                    </div>

                                    <div className="mt-10 space-y-4 px-4 text-left">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md hover:border-primary/20">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110">
                                                <PhoneEnabledIcon />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mobile Number</p>
                                                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{professionalData.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md hover:border-primary/20">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110">
                                                <EmailIcon />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{professionalData.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md hover:border-primary/20">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110">
                                                <WorkOutlineIcon />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Primary Skill</p>
                                                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{professionalData.skill}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex flex-col gap-3">
                                        <a
                                            href={`tel:${professionalData.phone}`}
                                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <PhoneEnabledIcon sx={{ fontSize: 18 }} />
                                            Call Now
                                        </a>
                                        <button
                                            onClick={() => setIsProModalOpen(false)}
                                            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                                        >
                                            Close Contact Info
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-16 text-center space-y-6">
                                <div className="text-6xl mx-auto">🕵️</div>
                                <h3 className="text-2xl font-black text-gray-900">Professional Not Found</h3>
                                <p className="text-gray-500 font-medium px-8">We couldn't retrieve the details for this professional. Please try again or contact support.</p>
                                <button
                                    onClick={() => setIsProModalOpen(false)}
                                    className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95"
                                >
                                    Go Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;
