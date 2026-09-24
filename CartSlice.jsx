import { createSlice } from '@reduxjs/toolkit';

const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // { name, image, price (number), quantity }
  },
  reducers: {
    addItem: (state, action) => {
      const { name, image, price } = action.payload;
      const existingItem = state.items.find((item) => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ name, image, price, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      const itemToUpdate = state.items.find((item) => item.name === name);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
    incrementQuantity: (state, action) => {
      const itemToUpdate = state.items.find((item) => item.name === action.payload);
      if (itemToUpdate) {
        itemToUpdate.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const itemToUpdate = state.items.find((item) => item.name === action.payload);
      if (itemToUpdate) {
        if (itemToUpdate.quantity > 1) {
          itemToUpdate.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.name !== action.payload);
        }
      }
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
} = CartSlice.actions;

export default CartSlice.reducer;
