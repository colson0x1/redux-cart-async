import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        'https://redux-cart-77e01-default-rtdb.firebaseio.com/cart.json',
      );

      if (!response.ok) {
        throw new Error('Could not fetch cart data!');
      }

      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(cartActions.replaceCart(cartData));
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Fetching cart data failed!',
        }),
      );
    }
  };
};

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
