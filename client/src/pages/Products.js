import React from "react";
import ItemList from "../components/ItemList";
import FilterMenu from "../components/FilterMenu";
import Cart from "../components/Cart";

const Products = () => {
  return (
    <div className="container">
      <Cart />
      <div className="container-2">
      <FilterMenu />
      <ItemList />
      </div>
    </div>
  );
};

export default Products;
