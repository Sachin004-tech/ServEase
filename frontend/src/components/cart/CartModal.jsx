import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../../redux/feature/cartSlice";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { IconButton } from "@mui/material";

const CartModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { items, total } = useSelector((state) => state.cart);

    const handleRemove = (item) => {
        dispatch(removeFromCart(item));
    };

    const handleClear = () => {
        dispatch(clearCart());
    };

    return (
        <div className="flex flex-col gap-4">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <RemoveShoppingCartIcon sx={{ fontSize: 60, mb: 2 }} />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <button
                        onClick={onClose}
                        className="mt-4 text-primary hover:underline font-semibold"
                    >
                        Go back to services
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-bold text-white">Your Items</h4>
                        <button
                            onClick={handleClear}
                            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((item) => (
                            <div
                                key={item._id || item.id}
                                className="flex items-center justify-between p-4 bg-gray-700 rounded-2xl border border-gray-600 hover:border-primary/50 transition-all group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-white group-hover:text-primary transition-colors">
                                        {item.service_name}
                                    </span>
                                    <span className="text-sm text-gray-400">₹{item.price}</span>
                                    {item.quantity > 1 && (
                                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                    )}
                                </div>
                                <IconButton
                                    onClick={() => handleRemove(item)}
                                    sx={{ color: "rgba(156, 163, 175, 1)", "&:hover": { color: "#f87171" } }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400 font-medium">Total Amount</span>
                            <span className="text-2xl font-black text-white">₹{total}</span>
                        </div>

                        <button
                            className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-primary/25 active:scale-[0.98] text-lg uppercase tracking-wider"
                            onClick={() => {
                                // Future implementation: logic for booking
                                console.log("Proceeding to book services...");
                            }}
                        >
                            BOOK service
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartModal;
