const EmptyBookings = () => {
    return (
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
    );
};

export default EmptyBookings;
