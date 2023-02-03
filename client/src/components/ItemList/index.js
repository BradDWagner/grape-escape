import React, { useEffect } from 'react';
import SingleItem from '../Item';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_ITEMS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_ITEMS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function ItemList() {
  const [state, dispatch] = useStoreContext();

  const { currentTag } = state;

  const { loading, data } = useQuery(QUERY_ITEMS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_ITEMS,
        items: data.items,
      });
      data.items.forEach((item) => {
        idbPromise('items', 'put', item);
      });
    } else if (!loading) {
      idbPromise('items', 'get').then((items) => {
        dispatch({
          type: UPDATE_ITEMS,
          items: items,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterItems() {
    if (!currentTag) {
      return state.items;
    }

    return state.items.filter(
      (item) => {
        for (let i=0; i<item.tags.length; i++) {
          if (item.tags[i]._id === currentTag) {
            return true
          }
        }
      }
    );
  }

  return (
    <div className="my-2">
      <h2>Available Wines</h2>
      {state.items.length ? (
        <div className="flex-row">
          {filterItems().map((item) => (
            <SingleItem key={item._id} _id={item._id} image={item.image} name={item.name} price={item.price}  />
          ))}
        </div>
      ) : (
        <h3>Your cart is EMPTY!</h3>
      )}
    </div>
  );
}

export default ItemList;