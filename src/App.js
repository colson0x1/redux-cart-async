import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

/*
 * Good way of having our side effects logic in a component and keeping
 * all our data transformation logic inside of our reducer which is which we
 * typically wanna have it when working with Redux
 * */
function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  // great thing is useSelector sets up a subscription to Redux, so whenever
  // our Redux store does change, this component function will be reexecuted
  // and we'll get the latest state i.e latest cart in our case
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    // POST requests will add new data in a lists of data
    // sending the PUT requests overrrides the existing cart with
    // the incoming data
    fetch('https://redux-cart-77e01-default-rtdb.firebaseio.com/cart.json', {
      method: 'PUT',
      body: JSON.stringify(cart),
    });
  }, [cart]);

  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
