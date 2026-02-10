import React from 'react';

const salonServices = [
    {
        id: 1,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png",
        title: "Waxing & Detan",
        rating: 4.8,
        reviews: "240K",
        price: 499,
        instant: true
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757731250-ba3ca0.png",
        title: "Facial & Clean-up",
        rating: 4.7,
        reviews: "110K",
        price: 899,
        instant: true
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1611059952044-8d9e27.png",
        title: "Pedicure & Manicure",
        rating: 4.8,
        reviews: "180K",
        price: 599,
        instant: true
    },
    {
        id: 4,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1603035303495-2c938d.png",
        title: "Hair Care",
        rating: 4.9,
        reviews: "150K",
        price: 799,
        instant: true
    }
];

const HomeBottomContent3 = () => {
    return (
        <section className="bg-gray-50 py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center">
                        Salon for women
                    </h1>
                    <h3 className="text-xl md:text-2xl font-medium text-gray-500 mt-4 text-center">
                        Pamper yourself at home
                    </h3>
                    <div className="mt-6 h-1.5 w-24 bg-gray-900 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {salonServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {service.instant && (
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-orange-100 flex items-center gap-1.5">
                                        <span className="text-orange-500 text-sm">⚡</span>
                                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">Instant</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                                    {service.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                                        <span className="text-xs font-bold text-green-700">{service.rating}</span>
                                        <span className="text-[10px] text-green-700 ml-0.5">★</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">({service.reviews})</span>
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
                                    <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl text-sm font-bold transition-colors">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeBottomContent3;
