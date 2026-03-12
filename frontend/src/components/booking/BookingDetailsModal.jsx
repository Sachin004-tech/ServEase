import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LiveProgressStepper from './LiveProgressStepper';

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

const BookingDetailsModal = ({ isOpen, loading, booking, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl transition-all border border-gray-100 animate-in fade-in zoom-in duration-300">
                {loading ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                        <p className="text-gray-400 font-bold">Loading Details...</p>
                    </div>
                ) : booking ? (
                    <div>
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Booking Details</h2>
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">ID: #{booking.booking_id}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {/* Stepper Integration */}
                                    <LiveProgressStepper currentStatus={booking.live_status || booking.status} />

                                    <section>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Service Details</h4>
                                        <p className="text-xl font-black text-gray-900">{booking.service_name}</p>
                                        <p className="text-primary font-bold text-2xl mt-1">₹{booking.amount}</p>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Professional</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">👤</div>
                                            <p className="font-bold text-gray-900">{booking.professional_name || "Assigning Professional..."}</p>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Booking Status</h4>
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-4 py-2 rounded-xl text-center text-xs font-black uppercase tracking-tighter border ${getStatusStyle(booking.status)}`}>
                                                Order Status: {booking.status}
                                            </span>
                                            <span className={`px-4 py-2 rounded-xl text-center text-xs font-black uppercase tracking-tighter border ${getStatusStyle(booking.live_status)}`}>
                                                Live Status: {booking.live_status}
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
                                                <p className="font-bold text-gray-900">{new Date(booking.booking_date).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <AccessTimeIcon className="text-primary" />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Time</p>
                                                <p className="font-bold text-gray-900">{new Date(`1970-01-01T${booking.booking_time}`).toLocaleTimeString("en-IN", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true
                                                })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <section>
                                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Metadata</h4>
                                        <div className="text-xs space-y-1 font-medium font-bold text-gray-900">
                                            <p>Booked on: {new Date(booking.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}</p>
                                            <p>Booking ID Reference: #{booking.booking_id}</p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex justify-end">
                            <button
                                onClick={onClose}
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
    );
};

export default BookingDetailsModal;
