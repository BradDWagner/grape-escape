import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

const CartItem = ({ item }) => {
    const [state, dispatch] = useStoreContext();

    const removeItem = item => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
        });
        idbPromise('cart', 'delete', { ...item });
    };

    const cartChange = (e) => {
        const value = e.target.value;
        if (value === '0') {
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            });
            idbPromise('cart', 'delete', { ...item });
        } else {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: parseInt(value)
            });
            idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
        }
    }
    return (
        <div className='flex-row'>
            <div>
                <img src={`/images/${item.image}`} alt='product image'
                />
            </div>
            <div className='cart-items'>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span className='qty'>Qty:</span>
                    <input className='qtybox' type='number' placeholder='1' value={item.purchaseQuantity} onChange={cartChange}
                    />
                    <span className='delete' role='img' aria-label='trash' onClick={() => removeItem(item)}>
                        Delete
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;