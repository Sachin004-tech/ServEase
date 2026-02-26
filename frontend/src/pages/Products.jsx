import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices } from '../api/auth';
import Modal from '../components/modal/Modal';
import Detail from '../components/Detail';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/feature/cartSlice';
import { toast } from 'react-toastify';

const Products = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const allServices = await getServices();
                const filtered = allServices.filter(s => s.category === category);
                setServices(filtered);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchServices();
        }
    }, [category]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight capitalize">
                        {category?.replace(/_/g, ' ')} Services
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Explore our range of professional {category?.replace(/_/g, ' ')} services tailored for you.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service._id || service.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{service.service_name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-green-600 font-bold text-sm">★ 4.8</span>
                                            <span className="text-gray-400 text-xs">(100+ reviews)</span>
                                        </div>
                                    </div>
                                    <span className="text-xl font-extrabold text-gray-900">₹{service.price}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                    {service.description || "High-quality professional service guaranteed to meet your expectations."}
                                </p>
                                <div className="flex justify-between items-center">
                                    <button onClick={() => {
                                        setSelectedService(service);
                                        setModal(true);
                                    }}
                                        className='w-1/2 bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-gray-800 transition-colors'>View details</button>
                                    <button
                                        onClick={() => {
                                            dispatch(addToCart(service));
                                            toast.success(`${service.service_name} added to cart!`);
                                        }}
                                        className="w-1/2 bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-gray-800 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-gray-900">No services found</h2>
                        <p className="text-gray-500 mt-2">We couldn't find any services for this category at the moment.</p>
                    </div>
                )}
            </div>
            <Modal isOpen={modal} onClose={() => {
                setModal(false);
                setSelectedService(null);
            }}
                size="xl"
            >
                <div>
                    <Detail service={selectedService} />
                </div>
            </Modal>
        </div>
    );
};

export default Products;
