import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_TAGS, UPDATE_CURRENT_TAG, } from '../../utils/actions';
import { QUERY_TAG } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function FilterMenu() {
    const [state, dispatch] = useStoreContext();

    const { tags } = state;

    const { loading, data: filterData } = useQuery(QUERY_TAG);

    useEffect(() => {
        if (filterData) {
            dispatch({
                type: UPDATE_TAGS,
                tags: filterData.tags,
            });
            filterData.tags.forEach((filter) => {
                idbPromise('tags', 'put', filter);
            });
        } else if (!loading) {
            idbPromise('tags', 'get').then((tags) => {
                dispatch({
                    type: UPDATE_TAGS,
                    tags: tags,
                });
            });
        }
    }, [filterData, loading, dispatch]);

    const handleClick = (id) => {
        dispatch({
            type: UPDATE_CURRENT_TAG,
            currentFilter: id,
        });
    };

    return (
        <div>
            <h2>tags:</h2>
            {tags.map((item) => (
                <button
                    key={item._id}
                    onClick={() => {
                        handleClick(item._id);
                    }}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
}

export default FilterMenu;