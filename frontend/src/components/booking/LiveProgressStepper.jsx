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

export default LiveProgressStepper;
