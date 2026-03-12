import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { formatDate, formatTime } from "../../utils/dateTime";

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

const BookingCard = ({ booking, onContact, onViewDetails, onCancel }) => {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: #{booking.booking_id}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formatDate(booking.created_at)}</p>
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
                            <p className="font-bold text-gray-900">{formatDate(booking.booking_date)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <AccessTimeIcon className="text-primary" sx={{ fontSize: 24 }} />
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</p>
                            <p className="font-bold text-gray-900">{formatTime(booking.booking_time)}</p>
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
                            onClick={() => onContact(booking.booking_id)}
                            className="flex-1 py-3 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary-hover transition-all active:scale-95 shadow-md"
                        >
                            Contact
                        </button>
                        <button
                            onClick={() => onViewDetails(booking.booking_id)}
                            className="flex-1 py-3 rounded-2xl bg-gray-900 text-white font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                        >
                            Details
                        </button>
                        <button
                            onClick={() => onCancel(booking.booking_id)}
                            className="flex-1 py-3 rounded-2xl border-2 border-red-100 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
