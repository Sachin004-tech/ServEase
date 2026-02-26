import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/feature/cartSlice';
import { toast } from 'react-toastify';

const Detail = ({ service }) => {
    const dispatch = useDispatch();

    if (!service) return null;

    const handleAddToCart = () => {
        dispatch(addToCart(service));
        toast.success(`${service.service_name} added to cart!`);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white overflow-hidden">
            {/* Service Image */}
            <div className="relative h-64 w-full bg-gray-100">
                {service.image ? (
                    <img
                        src={service.image}
                        alt={service.service_name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-5xl">🛠️</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-green-700 font-bold">★ 4.8</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{service.service_name}</h2>
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                            {service.category?.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-gray-900">₹{service.price}</span>
                        <p className="text-gray-400 text-sm font-medium">Inclusive of all taxes</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-gray-900 rounded-full"></span>
                            Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {service.description || "Our professional experts ensure high-quality service with satisfaction guaranteed. We use premium tools and follow all safety protocols to provide you with the best experience possible."}
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">What's included</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Professional Assessment
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> High-quality materials
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Skilled Professional
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Post-service cleanup
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="mt-10 flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detail;
