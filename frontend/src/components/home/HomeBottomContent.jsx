import React from 'react';

const HomeBottomContent = () => {
    return (
        <section className="bg-white py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        In the spotlight
                    </h2>
                    <div className="mt-4 h-1.5 w-24 bg-gray-900 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 justify-items-center">
                    {/* Item 1 */}
                    <div className="w-full relative shadow-lg bg-transparent group cursor-pointer border border-gray-100 rounded-3xl overflow-hidden">
                        <img
                            src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1764944093162-109227.jpeg"
                            alt="Spotlight 1"
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Item 2 */}
                    <div className="w-full relative shadow-lg bg-transparent group cursor-pointer border border-gray-100 rounded-3xl overflow-hidden">
                        <img
                            src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1770055841441-928944.jpeg"
                            alt="Spotlight 2"
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Item 3 */}
                    <div className="w-full relative shadow-lg bg-transparent group cursor-pointer border border-gray-100 rounded-3xl overflow-hidden">
                        <img
                            src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763463810678-7a7d86.jpeg"
                            alt="Spotlight 3"
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeBottomContent;
