import React from 'react';
import ProductList from '../components/ProductList';
import FilterMenu from '../components/FilterMenu';
import Cart from '../components/Cart';

const Home = () => {
    return (
        <div className='container'>
            <FilterMenu />
            <ProductList />
            <Cart />
        </div>
    );
};

export default Products;