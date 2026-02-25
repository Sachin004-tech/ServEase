import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTag, FiDollarSign, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ProfessionalSidebar from '../../layouts/sidebars/ProfessionalSidebar';
import { AddMyServices } from '../../redux/feature/services/serviceSlice';
import { useDispatch } from 'react-redux';

const ServicesForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        service_name: '',
        category: '',
        description: '',
        price: ''
    });

    const categories = [
        "Cleaning",
        "Plumbing",
        "Electrician",
        "Pest Control",
        "Salon for Women",
        "Salon for Men",
        "AC Repair & Service",
        "Appliance Repair",
        "Painting & Waterproofing"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and decimal
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                price: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { service_name, category, description, price } = formData;

            if (!service_name || !category || !description || !price) {
                toast.error("Please fill in all fields");
                return;
            }

            const serviceData = {
                service_name,
                category,
                description,
                price
            }
            console.log("Submitting Data:", serviceData);

            const res = await dispatch(AddMyServices(serviceData)).unwrap();
            console.log("Add service response:", res);

            if (res.success) {
                toast.success(res.message || "Service added successfully");
                setFormData({
                    service_name: '',
                    category: '',
                    description: '',
                    price: ''
                });
            }
        } catch (error) {
            console.error("Add service error:", error);
            toast.error(error.message || "Failed to add service");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <ProfessionalSidebar />
            <main className="flex-1 p-8 lg:ml-60 mt-16">
                <h1 className='text-2xl font-bold text-gray-800 mb-8'>Add New Service</h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FiPlus className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Add New Service</h2>
                            <p className="text-gray-500">Provide details for your professional service</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Service Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FiTag className="text-blue-500" /> Service Name
                            </label>
                            <input
                                type="text"
                                name="service_name"
                                value={formData.service_name}
                                onChange={handleChange}
                                placeholder="e.g. Premium Home Deep Cleaning"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FiFileText className="text-blue-500" /> Category
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FiDollarSign className="text-blue-500" /> Price (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handlePriceChange}
                                        placeholder="0.00"
                                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FiFileText className="text-blue-500" /> Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe what's included in this service..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 min-h-[120px] resize-y"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <FiPlus className="text-xl" />
                                Add Service
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ServicesForm;