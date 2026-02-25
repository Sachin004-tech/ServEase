import React from 'react';

const bookedServices = [
    {
        id: 1,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png",
        title: "Sofa Cleaning",
        rating: 4.8,
        reviews: "154K",
        price: 599
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757731250-ba3ca0.png",
        title: "Kitchen Cleaning",
        rating: 4.7,
        reviews: "98K",
        price: 999
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1611059952044-8d9e27.png",
        title: "Bathroom Cleaning",
        rating: 4.8,
        reviews: "210K",
        price: 399
    },
    {
        id: 4,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1603035303495-2c938d.png",
        title: "AC Servicing",
        rating: 4.9,
        reviews: "320K",
        price: 499
    },
    {
        id: 5,
        image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png",
        title: "Full Home Cleaning",
        rating: 4.7,
        reviews: "120K",
        price: 2499
    }
];

const HomeBottomContent2 = ({ services }) => {
    const mostBookedServices = services.slice(0, 5);
    console.log(mostBookedServices);
    return (
        <section className="bg-gray-50 py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Most booked services
                    </h1>
                    <div className="mt-4 h-1.5 w-24 bg-gray-900 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
                    {mostBookedServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
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

export default HomeBottomContent2;
