import React from 'react';

const CategorySection = ({ title, subtitle, category, services }) => {
    // Filter services based on the category
    const filteredServices = services.filter(service => service.category === category);

    if (filteredServices.length === 0) return null;

    return (
        <section className="bg-white py-20 px-4 md:px-8 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <h3 className="text-xl md:text-2xl font-medium text-gray-500 mt-4">
                            {subtitle}
                        </h3>
                    )}
                    <div className="mt-6 h-1.5 w-24 bg-gray-900 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredServices.map((service) => (
                        <div
                            key={service._id || service.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.service_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-1.5">
                                    <span className="text-orange-500 text-sm">⚡</span>
                                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">Bestseller</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                                    {service.service_name}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                                        <span className="text-xs font-bold text-green-700">4.8</span>
                                        <span className="text-[10px] text-green-700 ml-0.5">★</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">(10k+)</span>
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
                                    <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl text-sm font-bold transition-colors">
                                        Add
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

export default CategorySection;
