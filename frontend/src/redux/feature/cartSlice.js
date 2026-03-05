import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
    try {
        const savedCart = localStorage.getItem("cart");
        if (!savedCart) return { items: [], total: 0, quantity: 0 };

        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
            // Migration: Convert legacy array format to object format
            return {
                items: parsed,
                total: parsed.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0),
                quantity: parsed.reduce((sum, item) => sum + (item.quantity || 1), 0),
            };
        }
        return {
            items: parsed.items || [],
            total: Number(parsed.total) || 0,
            quantity: Number(parsed.quantity) || 0,
        };
    } catch (error) {
        console.error("Error loading cart from storage:", error);
        return { items: [], total: 0, quantity: 0 };
    }
};

const initialState = getInitialState();

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const id = String(newItem.service_id || newItem._id || newItem.id || "");

            const existingItem = state.items.find((item) => String(item.service_id || item._id || item.id) === id);
            const price = Number(newItem.price) || 0;

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                state.items.push({
                    ...newItem,
                    id: id,
                    quantity: 1,
                    price: price
                });
            }

            state.total = Number(state.total) + price;
            state.quantity += 1;
            localStorage.setItem("cart", JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            const id = String(action.payload.service_id || action.payload._id || action.payload.id || "");
            const existingItem = state.items.find((item) => String(item.service_id || item._id || item.id) === id);

            if (existingItem) {
                const itemPrice = Number(existingItem.price) || 0;
                const itemQuantity = existingItem.quantity || 1;
                state.total = Math.max(0, Number(state.total) - (itemPrice * itemQuantity));
                state.quantity = Math.max(0, state.quantity - itemQuantity);
                state.items = state.items.filter((item) => String(item.service_id || item._id || item.id) !== id);
                localStorage.setItem("cart", JSON.stringify(state));
            }
        },
        decrementQuantity: (state, action) => {
            const id = String(action.payload.service_id || action.payload._id || action.payload.id || "");
            const existingItem = state.items.find((item) => String(item.service_id || item._id || item.id) === id);

            if (existingItem && existingItem.quantity > 1) {
                const itemPrice = Number(existingItem.price) || 0;
                existingItem.quantity -= 1;
                state.total = Math.max(0, Number(state.total) - itemPrice);
                state.quantity -= 1;
                localStorage.setItem("cart", JSON.stringify(state));
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.quantity = 0;
            localStorage.setItem("cart", JSON.stringify(state));
        },
    },
});

export const { addToCart, removeFromCart, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;