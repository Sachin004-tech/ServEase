import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart, decrementQuantity, clearCart } from '../redux/feature/cartSlice';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';
import { createBooking } from '../api/auth';
import { toast } from 'react-toastify';

const Cart = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total } = useSelector((state) => state.cart);

    // Extract query params as requested
    const category = searchParams.get('category');
    const draftOrderId = searchParams.get('draftOrderId');

    const [formData, setFormData] = useState({
        service_id: "",
        booking_date: "",
        booking_time: ""
    });

    // Automatically set service_id from the first item in the cart
    useEffect(() => {
        if (items.length > 0 && !formData.service_id) {
            const firstItem = items[0];
            const id = firstItem.service_id || firstItem._id || firstItem.id;
            if (id) {
                setFormData(prev => ({ ...prev, service_id: String(id) }));
            }
        }
    }, [items, formData.service_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRemove = (item) => {
        console.log(item);
        dispatch(removeFromCart(item));
    };

    const handleIncrease = (item) => {
        dispatch(addToCart(item));
    };

    const handleDecrease = (item) => {
        dispatch(decrementQuantity(item));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleConfirmBooking = async () => {
        try {
            const response = await createBooking(formData);
            console.log(response);
            if (response.success) {
                toast.success(response.message);
                dispatch(clearCart());
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to book service');
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

                        <div className="space-y-6">
                            {/* Location */}
                            {/* <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <LocationOnIcon fontSize="small" className="text-primary" />
                                    Service Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full address"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div> */}

                            {/* Contact Number */}
                            {/* <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <PhoneIcon fontSize="small" className="text-primary" />
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter 10-digit mobile number"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div> */}

                            {/* Preferred Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <AccessTimeIcon fontSize="small" className="text-primary" />
                                    Booking Date
                                </label>
                                <input
                                    type="date"
                                    name="booking_date"
                                    value={formData.booking_date}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            {/* Preferred Time */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <AccessTimeIcon fontSize="small" className="text-primary" />
                                    Booking Time
                                </label>
                                <input
                                    type="time"
                                    name="booking_time"
                                    value={formData.booking_time}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <PaymentIcon fontSize="small" className="text-primary" />
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['cash', 'online'].map((method) => (
                                        <label
                                            key={method}
                                            className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method}
                                                checked={formData.paymentMethod === method}
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                            <span className="font-bold capitalize">{method === 'cash' ? 'Pay Cash' : 'Pay Online'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-4">
                                Order ID: <span className="font-mono">{draftOrderId || 'N/A'}</span> |
                                Category: <span className="capitalize">{category?.replace(/_/g, ' ') || 'N/A'}</span>
                            </p>
                            <button onClick={() => { handleConfirmBooking() }} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                                Confirm Booking
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Selected Item Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Service Summary</h2>
                                {items.length > 0 && (
                                    <button
                                        onClick={handleClearCart}
                                        className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                        Clear Cart
                                    </button>
                                )}
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-400">Your cart is empty</p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="mt-4 text-primary font-bold hover:underline"
                                    >
                                        Browse Services
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                        {items.map((item) => (
                                            <div key={item._id || item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                                                {/* Item Image */}
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.service_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">🛠️</div>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.service_name}</h4>
                                                        <IconButton
                                                            onClick={() => handleRemove(item)}
                                                            size="small"
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-black text-gray-900">₹{item.price}</span>
                                                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-2 py-0.5">
                                                            <button onClick={() => handleIncrease(item)} className="p-1 hover:text-primary transition-colors">
                                                                <AddIcon sx={{ fontSize: 16 }} />
                                                            </button>
                                                            <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                                                            <button onClick={() => handleDecrease(item)} className="p-1 hover:text-primary transition-colors">
                                                                <RemoveIcon sx={{ fontSize: 16 }} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 space-y-3">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span>₹{total}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Service Fee</span>
                                            <span>₹0</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-xl font-bold text-gray-900">Total Amount</span>
                                            <span className="text-3xl font-black text-primary">₹{total}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
