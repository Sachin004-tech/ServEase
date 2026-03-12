import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

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

const ProfessionalModal = ({ isOpen, loading, professional, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 h-full">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[40px] w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden shadow-2xl transition-all border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-500">
                {loading ? (
                    <div className="p-24 text-center space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
                        <p className="text-gray-400 font-bold animate-pulse">Connecting to Professional...</p>
                    </div>
                ) : professional ? (
                    <div className="flex flex-col overflow-y-auto">
                        {/* Header / Profile Section */}
                        <div className="relative h-32 bg-primary/10 flex items-center justify-center">
                            <div className="absolute -bottom-12 w-24 h-24 rounded-[32px] bg-white border-4 border-white shadow-xl flex items-center justify-center text-4xl overflow-hidden">
                                <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary font-black">
                                    {professional?.data?.name?.charAt(0)}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/50 flex items-center justify-center text-gray-700 hover:bg-red-400 cursor-pointer transition-all shadow-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="px-6 pt-16 pb-6 text-center">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{professional?.data?.name}</h2>
                            <p className="text-primary font-bold flex items-center justify-center gap-1 mt-1 lowercase">
                                <BadgeIcon sx={{ fontSize: 16 }} />
                                {professional?.data?.skill || 'Expert Professional'}
                            </p>

                            <div className="mt-8 flex justify-center gap-2">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(professional?.status)}`}>
                                    Status: {professional?.data?.status}
                                </span>
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(professional?.live_status)}`}>
                                    Live: {professional?.data?.live_status}
                                </span>
                            </div>

                            <div className="mt-6 space-y-3 px-4 text-left">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md hover:border-primary/20">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110">
                                        <PhoneEnabledIcon />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mobile Number</p>
                                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{professional?.data?.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md hover:border-primary/20">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110">
                                        <EmailIcon />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{professional?.data?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md hover:border-primary/20">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110">
                                        <WorkOutlineIcon />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Primary Skill</p>
                                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{professional?.data?.skill}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                <a
                                    href={`tel:${professional?.data?.phone}`}
                                    className="cursor-pointer w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <PhoneEnabledIcon sx={{ fontSize: 18 }} />
                                    Call Now
                                </a>
                                <button
                                    onClick={onClose}
                                    className="cursor-pointer w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
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
                            onClick={onClose}
                            className="cursor-pointer bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessionalModal;
