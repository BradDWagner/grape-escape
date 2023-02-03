import React from "react";
import ItemList from "../components/ItemList";
import FilterMenu from "../components/FilterMenu";
import Cart from "../components/Cart";

const Products = () => {
  return (
    <div className="container">
      <FilterMenu />
      <ItemList />
      <Cart />
    </div>
  );
};

export default Products;
