import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      // no matter if we have an existing item or not, the total quantity
      // will simply increase by 1. we have one more item in the cart.
      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({
          itemId: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        // item does exist
        existingItem.quantity++;
        // when clicked again on the add to cart,
        // increase existing total price by adding item price again
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      // find that item with that id and remove it from the array
      // we dont need to check if its part of the array we know that it will be part
      // but we need to find out how many items are in the array
      const existingItem = state.items.find((item) => item.id === id);

      // no matter if we have that item in the cart once or multiple times,
      // we definitaly wanna reduce the total quantity by 1
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        // remove the item from the array
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        // if greater than 1, reduce the quantity by 1
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
