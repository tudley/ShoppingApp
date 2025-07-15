import { useState } from "react";
import SortSelector from "./SortSelector";
import FilterSelector from "./FilterSelector";
import Basket from "./Basket";
import SearchBar from "./SearchBar";

const NavBar = ({
  stock,
  cart,
  sortHighRating,
  sortLowRating,
  sortHighPrice,
  sortLowPrice,
  setCategoryFilter,
  updateSearchQuery,
  searchQuery,
  updateCart,
  removeItemFromBasket,
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showBasket, setShowBasket] = useState(false);

  const returnCartLength = () => {
    let cartLength = 0;
    cart.map((item) => {
      cartLength += item.qty;
    });
    return cartLength;
  };

  return (
    <div className="navBar">
      <div className="sortAndFilterWrapper">
        <div
          className="sortWrapper"
          onMouseEnter={() => setShowSortMenu(true)}
          onMouseLeave={() => setShowSortMenu(false)}
        >
          <button>Sort by...</button>
          {showSortMenu && (
            <SortSelector
              sortHighRating={sortHighRating}
              sortLowRating={sortLowRating}
              sortLowPrice={sortLowPrice}
              sortHighPrice={sortHighPrice}
            />
          )}
        </div>
        <div
          className="filterWrapper"
          onMouseEnter={() => setShowFilterMenu(true)}
          onMouseLeave={() => setShowFilterMenu(false)}
        >
          <button>Filter by...</button>
          {showFilterMenu && (
            <FilterSelector
              stock={stock}
              setCategoryFilter={setCategoryFilter}
            />
          )}
        </div>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        updateSearchQuery={updateSearchQuery}
      />
      <div
        className="basketWrapper"
        onMouseEnter={() => setShowBasket(true)}
        onMouseLeave={() => setShowBasket(false)}
      >
        <button className="checkoutButton">
          Basket:
          {returnCartLength() == 0 ? "Empty" : `(${returnCartLength()})`}
        </button>
        {showBasket && (
          <Basket
            cart={cart}
            returnCartLength={returnCartLength}
            updateCart={updateCart}
            removeItemFromBasket={removeItemFromBasket}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
