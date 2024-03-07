import { useDispatch, useSelector } from 'react-redux';

import { cartActions } from '../../store/cart-slice';
import Card from '../UI/Card';
import classes from './ProductItem.module.css';

/*
NOTE!
At the moment, we have sideeffect free synchronous code inside Component and 
that is suboptimal code because we're performing data transformation in the 
component and not inside of the reducers 
*/
const ProductItem = (props) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { title, price, description, id } = props;

  const addToCartHandler = () => {
    // we can write mutating code inside of the reducer function when used
    // Redux Toolkit but here, we must not do that
    /* cart.totalQuantity = cart.totalQuantity + 1; */
    // that changes JavaScript object in memory which is also part of the
    // redux store without making redux aware of it
    // so we can't do that here because we would be changing outside of the
    // reducer function
    // we must never mutate redux state
    // we have to write the code in immutable way
    const newTotalQuantity = cart.totalQuantity + 1;

    // here similar things for updating the items
    // copying items in the cart with the slice method
    // slice creates a brand new array with the existing objects but a new array
    const updatedItems = cart.items.slice(); // create copy via slice to avoid mutating original state
    const existingItem = updatedItems.find((item) => item.id === id);
    // existingItem will still be an object in memory which is part of the
    // redux store because objects are reference values in JavaScript
    // so copying that object into a new object as well
    if (existingItem) {
      const updatedItem = { ...existingItem }; // new object + copy existing properties to avoid state mutation
      updatedItem.quantity++;
      updatedItem.totalPrice = updatedItem.totalPrice + price;
      const existingItemIndex = updatedItems.findIndex(
        (item) => item.id === id,
      );
      // replace current item in our cart with the updatedItem
      updatedItems[existingItemIndex] = updatedItem;
    } else {
      // if we don't have the item as part of the cart before, we push brand
      // new object to updatedItems array
      updatedItems.push({
        id: id,
        price: price,
        quantity: 1,
        totalPrice: price,
        name: title,
      });
    }

    // and then we derieve a new cart by creating a new object
    const newCart = {
      totalQuantity: newTotalQuantity,
      items: updatedItems,
    };

    // here we're dispatching an action creator which will override the
    // redux store with new data
    dispatch(cartActions.replaceCart(newCart));

    // and then send Http request
    // fetch('firebase-url', { method: 'POST', body: JSON.stringify(newCart) })

    // dispatch(
    //   cartActions.addItemToCart({
    //     id,
    //     title,
    //     price,
    //   })
    // );
  };

  return (
    <li className={classes.item}>
      <Card>
        <header>
          <h3>{title}</h3>
          <div className={classes.price}>${price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className={classes.actions}>
          <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
