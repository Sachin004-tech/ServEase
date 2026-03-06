import React, { useState, useEffect } from "react";
import ProfessionalSidebar from "../../layouts/sidebars/ProfessionalSidebar";
// import { getMyServices, deleteService, editService } from "../../api/auth";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMyServices, updateService, removeService, toggleServiceStatus } from "../../redux/feature/services/serviceSlice";
import { useDispatch, useSelector } from "react-redux";

const ManageServices = () => {
    const dispatch = useDispatch();
    const { services, loading, error: reduxError } = useSelector((state) => state.service);
    const [editingService, setEditingService] = useState(null);
    const [editFormData, setEditFormData] = useState({
        service_name: "",
        category: "",
        description: "",
        price: ""
    });
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => {
        console.log("Current services state:", services);
        console.log("Loading state:", loading);
        if (reduxError) {
            console.error("Redux error:", reduxError);
            toast.error(reduxError);
        }
    }, [services, loading, reduxError]);

    const fetchServices = async () => {
        try {
            console.log("Dispatching fetchMyServices...");
            const result = await dispatch(fetchMyServices());
            console.log("Fetch result:", result);
        } catch (error) {
            console.error("Fetch services error:", error);
            toast.error("Failed to load services");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await dispatch(removeService(id));
                toast.success("Service deleted successfully");
                fetchServices();
            } catch (error) {
                toast.error("Failed to delete service");
            }
        }
    };

    const handleEditClick = (id) => {
        setEditingService(id);
        const service = services.find((service) => service.service_id === id);
        setEditFormData({
            service_name: service.service_name,
            category: service.category,
            description: service.description,
            price: service.price
        });
    };

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

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: name === "price" ? (value === "" ? "" : Number(value)) : value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateService({ serviceId: editingService, serviceData: editFormData }));
            toast.success("Service updated successfully");
            setEditingService(null);
            fetchServices();
        } catch (error) {
            toast.error("Failed to update service");
        }
    };

    const handleStatusChange = async (serviceId, currentStatus) => {
        try {
            setUpdatingStatus(serviceId);
            const resultAction = await dispatch(toggleServiceStatus(serviceId));
            if (toggleServiceStatus.fulfilled.match(resultAction)) {
                toast.success(`Service status updated to ${resultAction.payload.new_status}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        } finally {
            setUpdatingStatus(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <ProfessionalSidebar />
            <main className="flex-1 p-4 md:p-8 lg:ml-64 mt-16 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Manage Services</h1>
                            <p className="text-gray-600">Overview of your active professional services.</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-sm text-gray-500">Total Services: </span>
                            <span className="font-bold text-primary">{services?.length}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 font-semibold text-gray-700">
                                    <th className="px-6 py-4">Service Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Price (₹)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Loading your services...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : services?.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                                No services found. Add your first service to see it here!
                                            </td>
                                        </tr>
                                    ) : (
                                        services?.map((service) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                key={service.service_id}
                                                className="hover:bg-gray-50/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-800">{service.service_name}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                        {service.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                                                    {service.description}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-800">₹{service.price}</td>
                                                <td className="px-6 py-4">
                                                    <div className="relative">
                                                        <select
                                                            value={service.status || "active"}
                                                            onChange={() => handleStatusChange(service.service_id)}
                                                            disabled={updatingStatus === service.service_id}
                                                            className={`appearance-none px-3 py-1 pr-8 rounded-full text-xs font-semibold focus:outline-none transition-colors cursor-pointer disabled:opacity-50 ${(service.status || "active") === "active"
                                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                                                }`}
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                                            {updatingStatus === service.service_id ? (
                                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <svg className="w-3 h-3 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => handleEditClick(service.service_id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Service"
                                                        >
                                                            <FiEdit2 size={18} />
                                                        </button>
                                                        <button
                                                            key={service.service_id}
                                                            onClick={() => handleDelete(service.service_id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Service"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingService && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setEditingService(null)}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Edit Service</h2>
                                    <button
                                        onClick={() => setEditingService(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Service Name</label>
                                        <input
                                            type="text"
                                            name="service_name"
                                            value={editFormData.service_name}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Category</label>
                                            <select
                                                name="category"
                                                value={editFormData.category}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat, idx) => (
                                                    <option key={idx} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={editFormData.price}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Description</label>
                                        <textarea
                                            name="description"
                                            value={editFormData.description}
                                            onChange={handleEditChange}
                                            rows="4"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setEditingService(null)}
                                            className="px-6 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                                        >
                                            <FiCheck />
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ManageServices;