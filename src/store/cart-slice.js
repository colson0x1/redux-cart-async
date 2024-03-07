import { createSlice } from '@reduxjs/toolkit';

import { uiActions } from './ui-slice';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      // no matter if we have an existing item or not, the total quantity
      // will simply increase by 1. we have one more item in the cart.
      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
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

/* @ Thunk Action Creator */
// custom action creator function
export const sendCartData = (cart) => {
  return async (dispatch) => {
    // dispatch the actual action we want to perform
    // currently sending the requests
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      }),
    );

    // we create this separate sendRequest func for request for error
    // handling
    const sendRequest = async () => {
      // POST requests will add new data in a lists of data
      // sending the PUT requests overrrides the existing cart with
      // the incoming data
      const response = await fetch(
        'https://redux-cart-77e01-default-rtdb.firebaseio.com/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify(cart),
        },
      );

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }
    };

    // here we handle that error of calling that function in try catch
    try {
      await sendRequest();

      // no error, we dispatch success notification
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!',
        }),
      );
    } catch (error) {
      // error, we dispatch an error notification
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!',
        }),
      );
    }
  };
};

export const cartActions = cartSlice.actions;

export default cartSlice;
