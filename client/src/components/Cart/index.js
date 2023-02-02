import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';

const stripe = loadStripe(process.env.STRIPE_CLIENT);

const Cart = () => {
    const [state, dispatch] = useStoreContext();
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

    useEffect(() => {
        if (data) {
            stripe.then((res) => {
                res.redirectToCheckout({ sessionID: data.checkout.session });
            });
        }
    }, [data]);

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
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
            variables: { products: productIds },
        });
    }

    if (!state.cartOpen) {
        return (
            <div className='cart-closed' onClick={cartToggle}>
                <span role='img' aria-label='cart'>
                    🛒
                </span>
            </div>
        );
    }

    return (
        <div className='cart'>
            <div className='close' onClick={cartToggle}>
                [close]
            </div>
            <h2>Your Cart</h2>
            {state.cart.length ? (
                <div>
                    {state.cart.map((item) => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className='flex-row space-between'>
                        <strong>Total: ${cartTotal}</strong>

                        {Auth.loggedIn() ? (
                            <button onClick={submitOrder}>Submit Order</button>
                        ) : (
                            <span>(log in to check out)</span>
                        )}
                    </div>
                </div>
            ) : (
                <h3>
                    <span role='img' aria-label='broken heart'>💔</span>
                    Your cart is EMPTY!
                </h3>
            )}
        </div>
    );
};

export default Cart;
