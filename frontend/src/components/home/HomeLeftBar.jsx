import React from 'react';

const services = [
    { title: 'AC Repair', icon: '❄️' },
    { title: 'Cleaning', icon: '🧹' },
    { title: 'Plumbing', icon: '🔧' },
    { title: 'Electrician', icon: '⚡' },
    { title: 'Painting', icon: '🎨' },
    { title: 'Pest Control', icon: '🐜' },
    { title: 'Salon at Home', icon: '✂️' },
    { title: 'Massage', icon: '💆' },
];

const HomeLeftBar = () => {
    return (
        <div className="w-full md:w-5/12 bg-transparent border-0 border-black box-border flex basis-auto shrink-0 list-none m-0 min-h-0 min-w-0 p-0 relative no-underline z-0 flex-col justify-center md:sticky md:top-4">
            {/* Heading Section */}
            <div className="mb-10">
                <h1 className="text-xl md:text-5xl lg:text-2xl font-bold text-gray-900 tracking-tight leading-tight mb-8 text-center">
                    Home services at <br /> your doorstep
                </h1>
            </div>

            {/* Services Grid Section */}
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    What are you looking for?
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl md:text-3xl mb-3 shadow-inner">
                                {service.icon}
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-gray-800 text-center">
                                {service.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Stats Section */}
            <div className="flex gap-8 md:gap-16 justify-center mt-12">
                <div className="flex items-start gap-3">
                    <img
                        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_48,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693570188661-dba2e7.jpeg"
                        alt="Service Rating Icon"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-2xl md:text-3xl font-bold text-gray-900">4.8</span>
                            <span className="text-xl md:text-2xl text-yellow-500">★</span>
                        </div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Service Rating*
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <img
                        src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_48,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693491890812-e86755.jpeg"
                        alt="Customers Globally Icon"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900">12M+</span>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Customers Globally*
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeLeftBar;
