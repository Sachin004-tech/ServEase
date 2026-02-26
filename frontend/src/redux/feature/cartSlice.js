import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    total: 0,
    quantity: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const id = String(newItem._id || newItem.id || "");

            const existingItem = state.items.find((item) => String(item._id || item.id) === id);
            const price = Number(newItem.price) || 0;

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                state.items.push({
                    ...newItem,
                    id,
                    quantity: 1,
                    price: price
                });
            }

            state.total = Number(state.total) + price;
            state.quantity += 1;
        },
        removeFromCart: (state, action) => {
            const id = String(action.payload._id || action.payload.id || "");
            const existingItem = state.items.find((item) => String(item._id || item.id) === id);

            if (existingItem) {
                const itemPrice = Number(existingItem.price) || 0;
                const itemQuantity = existingItem.quantity || 1;
                state.total = Math.max(0, Number(state.total) - (itemPrice * itemQuantity));
                state.quantity = Math.max(0, state.quantity - itemQuantity);
                state.items = state.items.filter((item) => String(item._id || item.id) !== id);
            }
        },
        decrementQuantity: (state, action) => {
            console.log("Payload ID:", action.payload._id, action.payload.id);
            const id = String(action.payload._id || action.payload.id || "");
            const existingItem = state.items.find((item) => String(item._id || item.id) === id);
            console.log("Matching ID:", id);
            console.log("Existing Item:", existingItem);

            if (existingItem && existingItem.quantity > 1) {
                const itemPrice = Number(existingItem.price) || 0;
                existingItem.quantity -= 1;
                state.total = Math.max(0, Number(state.total) - itemPrice);
                state.quantity -= 1;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.quantity = 0;
        },
    },
});

export const { addToCart, removeFromCart, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;