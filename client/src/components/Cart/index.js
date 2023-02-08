import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
    const [state, dispatch] = useStoreContext();
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session });
            });
        }
    }, [data]);

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({ type: ADD_MULTIPLE_TO_CART, items: [...cart] });
        }

        if (!state.cart.length) {
            getCart();
        }
    }, [state.cart.length, dispatch]);

    function cartToggle() {
        dispatch({ type: TOGGLE_CART });
    }

    function cartTotal() {
        let sum = 0;
        state.cart.forEach((item) => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    function submitOrder() {
        const productIds = [];
        state.cart.forEach((item) => {
            for (let i = 0; i < item.purchaseQuantity; i++) {
                productIds.push(item._id);
            }
        });

        getCheckout({
            variables: { items: productIds },
        });
    }

    function cartQuantity() {
        let quantity = 0
        for (let i=0; i< state.cart.length; i++) {
            quantity = quantity + state.cart[i].purchaseQuantity
        }
        return quantity
    }

    if (!state.cartOpen) {
        return (
            <div className='cart-closed' onClick={cartToggle}>
                <span role='img' aria-label='cart' className='cart'>
                    Cart   
                    <span>{cartQuantity()}</span>
                </span>
            </div>
        );
    }

    return (
        <div className='cart'>
            <div className='close' onClick={cartToggle}>
                Close Cart
            </div>
            <h2 className='cart-title'>Your Shopping Cart</h2>
            {state.cart.length ? (
                <div className='cart-container'>
                    {state.cart.map((item) => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className='cart-text flex-row space-between'>
                        <strong>Total: ${cartTotal()}</strong>

                        {Auth.loggedIn() ? (
                            <button className='button' onClick={submitOrder}>Submit Order</button>
                        ) : (
                            <span>(log in to check out)</span>
                        )}
                    </div>
                </div>
            ) : (
                <h3>
                    Cart Empty
                </h3>
            )}
        </div>
    );
};

export default Cart;
