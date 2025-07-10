import { useEffect, useState } from "react";
import getItems from "./APIGateway";
import "./App.css";

function App() {
  // useStates
  // stock is my array of all items (stored as objects). it is initialised from the API response.
  const [stock, setStock] = useState([]); // set this as empty, as useState will not wait for the promise to be fufilled

  const [cart, setCart] = useState([]);

  const fetchData = async () => {
    const items = await getItems();
    setStock(items);
  };

  const sortHighRating = () => {
    const sorted = [...stock].sort((a, b) => b.rating.rate - a.rating.rate);
    setStock(sorted);
  };

  const sortLowRating = () => {
    const sorted = [...stock].sort((a, b) => a.rating.rate - b.rating.rate);
    setStock(sorted);
  };

  const sortHighPrice = () => {
    const sorted = [...stock].sort((a, b) => b.price - a.price);
    setStock(sorted);
  };

  const sortLowPrice = () => {
    const sorted = [...stock].sort((a, b) => a.price - b.price);
    setStock(sorted);
  };

  useEffect(() => {
    //setStock(getItems()); // even though getItems internally awaits for the API call, getItems immediately returns a promise, because it's asynchronous
    fetchData();
  }, []);

  const addItemToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <>
      <NavBar
        stock={stock}
        cart={cart}
        sortHighRating={sortHighRating}
        sortLowRating={sortLowRating}
        sortHighPrice={sortHighPrice}
        sortLowPrice={sortLowPrice}
      />
      {/* <button onClick={async () => console.log(await getItems())}>
        Print Items
      </button> */}
      <div className="itemGrid">
        {stock.map((item) => {
          return (
            <ItemCard item={item} addItemtoCart={addItemToCart} key={item.id} />
          );
        })}
      </div>
    </>
  );
}

export default App;

const ItemCard = ({ item, addItemtoCart }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const descriptionString = showFullDescription
    ? item.description
    : item.description.length > 50
    ? item.description.slice(0, 50) + "..."
    : item.description;

  const ratingToString = (rating) => {
    let ratingString = "";
    const star = "⭐";
    const intRating = Math.round(rating);
    for (let i = 0; i < intRating; i++) {
      ratingString += star;
    }
    return ratingString;
  };

  return (
    <>
      <div className="itemCard">
        <h3>{item.title}</h3>
        <img className="itemCardImage" src={item.image} alt="oops" />
        <p onClick={() => setShowFullDescription(!showFullDescription)}>
          {descriptionString}
        </p>
        <div className="buyBar">
          <p>£{item.price.toFixed(2)}</p>
          <p>{ratingToString(item.rating.rate)}</p>
          <button className="buyButton" onClick={() => addItemtoCart(item)}>
            Buy
          </button>
        </div>
      </div>
    </>
  );
};

const NavBar = ({
  stock,
  cart,
  sortHighRating,
  sortLowRating,
  sortHighPrice,
  sortLowPrice,
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <div className="navBar">
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
            categories={[...new Set(stock.map((item) => item.category))]}
          />
        )}
      </div>
      <div className="checkoutButtonWrapper">
        <button className="checkoutButton">
          Basket: {cart.length == 0 ? "Empty" : `(${cart.length})`}
        </button>
      </div>
    </div>
  );
};

const SortSelector = ({
  sortHighRating,
  sortLowRating,
  sortHighPrice,
  sortLowPrice,
}) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="sortSelector">
      <button
        onMouseEnter={() => setHovered("rating")}
        onMouseLeave={() => setHovered(null)}
      >
        Rating...
      </button>

      <button
        onMouseEnter={() => setHovered("price")}
        onMouseLeave={() => setHovered(null)}
      >
        Price...
      </button>

      {hovered === "rating" && (
        <div
          className="subSortSelector"
          style={{ top: "0rem" }}
          onMouseEnter={() => setHovered("rating")}
          onMouseLeave={() => setHovered(null)}
        >
          <button onClick={sortHighRating}>Highest Rated</button>
          <button onClick={sortLowRating}>Lowest Rated</button>
        </div>
      )}

      {hovered === "price" && (
        <div
          className="subSortSelector"
          style={{ top: "2.5rem" }}
          onMouseEnter={() => setHovered("price")}
          onMouseLeave={() => setHovered(null)}
        >
          <button onClick={sortHighPrice}>Highest Price</button>
          <button onClick={sortLowPrice}>Lowest Price</button>
        </div>
      )}
    </div>
  );
};

const FilterSelector = ({ categories }) => {
  return (
    <div className="filterSelector">
      {categories.map((category) => {
        return <button>{category}</button>;
      })}
    </div>
  );
};
