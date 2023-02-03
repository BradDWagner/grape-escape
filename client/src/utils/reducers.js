import { useReducer } from "react";
import {
  UPDATE_ITEMS,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_TAGS,
  UPDATE_CURRENT_TAG,
  CLEAR_CART,
  TOGGLE_CART
} from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_ITEMS:
      return {
        ...state,
        items: [...action.items],
      };

    case ADD_TO_CART:
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.item],
      };

    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.items],
      };

    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map(item => {
          if (action._id === item._id) {
            item.purchaseQuantity = action.purchaseQuantity
          }
          return item
        })
      };

    case REMOVE_FROM_CART:
      let newState = state.cart.filter(item => {
        return item._id !== action._id;
      });

      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState
      };

    case CLEAR_CART:
      return {
        ...state,
        cartOpen: false,
        cart: []
      };

    case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen
      };

    case UPDATE_TAGS:
      return {
        ...state,
        tags: [...action.tags],
      };

    case UPDATE_CURRENT_TAG:
      return {
        ...state,
        currentTag: action.currentTag
      }

    default:
      return state;
  }
};

export function useItemReducer(initialState) {
  return useReducer(reducer, initialState)
}