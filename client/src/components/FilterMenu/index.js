import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_TAGS, UPDATE_CURRENT_TAG, } from '../../utils/actions';
import { QUERY_TAG } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function FilterMenu() {
    const [state, dispatch] = useStoreContext();

    const { filters } = state;

    const { loading, data: filterData } = useQuery(QUERY_TAG);

    useEffect(() => {
        if (filterData) {
            dispatch({
                type: UPDATE_TAGS,
                filters: filterData.filters,
            });
            filterData.filters.forEach((filter) => {
                idbPromise('filters', 'put', filter);
            });
        } else if (!loading) {
            idbPromise('filters', 'get').then((filters) => {
                dispatch({
                    type: UPDATE_TAGS,
                    filters: filters,
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
            <h2>Filters:</h2>
            {filters.map((item) => (
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