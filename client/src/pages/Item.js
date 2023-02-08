
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import Cart from '../components/Cart';
import { useStoreContext } from '../utils/GlobalState';
import {
  ADD_TO_CART,
  UPDATE_ITEMS,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART
} from '../utils/actions';
import { QUERY_ITEMS } from '../utils/queries';
import { ADD_COMMENT } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';
import Auth from '../utils/auth'

function Item() {
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();
  const [currentItem, setCurrentItem] = useState({});
  const [commentInput, setCommentInput] = useState({})
  const { loading, data } = useQuery(QUERY_ITEMS);
  const [addComment, { error }] = useMutation(ADD_COMMENT)
  const { items, cart } = state;

  useEffect(() => {
    if (items.length) {
      setCurrentItem(items.find((item) => item._id === id));
    } else if (data) {
      dispatch({
        type: UPDATE_ITEMS,
        items: data.items,
      });
      data.items.forEach((item) => {
        idbPromise("items", "put", item);
      });
    } else if (!loading) {
      idbPromise("items", "get").then((indexedItems) => {
        dispatch({
          type: UPDATE_ITEMS,
          items: indexedItems,
        });
      });
    }
  }, [items, data, loading, dispatch, id]);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        item: { ...currentItem, purchaseQuantity: 1 },
      });
      idbPromise("cart", "put", { ...currentItem, purchaseQuantity: 1 });
    }
  };
  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentItem._id,
    });
    idbPromise("cart", "delete", { ...currentItem });
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setCommentInput({
      value
    })
  }

  const handleCommentSubmit = async (event) => {
    try {
      const newComment = await addComment({
        variables: { _id: id, comment: commentInput.value }
      })
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      {currentItem && cart ? (
        <div className="container">
          
          <Link to="/">Back to Products</Link>
          <Cart />

          <div className='item-description'>
            <h2>{currentItem.name}</h2>
            <p>{currentItem.description}</p>
          </div>


          <p>
            <strong>Price:</strong>${currentItem.price}{" "}
            <button
              className='button2'
              disabled={!Auth.loggedIn()}
              onClick={addToCart}
            >
              Add to Cart</button>
            <button
            className='button2'
              disabled={!cart.find((p) => p._id === currentItem._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img src={`/images/${currentItem.image}`} alt={currentItem.name} />

          {Auth.loggedIn() ?
            <div className='comment-box'>
              <h3>Tell us what you think!</h3>
              <form onSubmit={handleCommentSubmit}>
                <div>
                  <textarea
                    placeholder="Leave a review"
                    name="comment"
                    type="text"
                    id="comment"
                    onChange={handleChange}
                  />

                </div>
                <div>
                  <button type="submit">Send</button>
                </div>
              </form>
              <hr/>
            </div> : null}


          {currentItem.reviews ? (
            <div className='review-box'>
              <h2>Here's what others had to say about this product</h2>

              {currentItem.reviews.map((review) => (
                <div className='review'>
                  <div key={review._id}>
                    <h3>{review.user.firstName} says:</h3>
                    <p>{review.comment}</p>
                    <hr />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

    </>
  );
}

export default Item;
