import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreContext } from '../../utils/GlobalState';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

function SingleItem(item) {
  const [state, dispatch] = useStoreContext();

  const { image, name, _id, price, quantity } = item;

  const { cart } = state;

  const addToCart = () => {
    const inCart = cart.find((cartItem) => cartItem._id === _id)
    if (inCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(inCart.purchaseQuantity) + 1
      });
      idbPromise('cart', 'put', {
        ...inCart,
        purchaseQuantity: parseInt(inCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  }

  return (
    <div className='card px-1 py-1'>
      <Link to={`/products/${_id}`}>
        <img alt={name} src={`/images/${image}`}/>
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default SingleItem;