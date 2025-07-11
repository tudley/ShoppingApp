import { useEffect, useState } from "react";
import getItems from "./APIGateway";
import "./App.css";
import NavBar from "./components/NavBar";
import ItemCard from "./components/ItemCard";

function App() {
  // useStates
  // stock is my array of all items (stored as objects). it is initialised from the API response.
  const [stock, setStock] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [currentStock, setCurrentStock] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // fetch data on initialisation
  useEffect(() => {
    fetchData();
  }, []);

  // when searchQuery changes, update currentStock
  useEffect(() => {
    let result = stock;

    if (categoryFilter) {
      console.log(result);
      result = filterByCategory(result, categoryFilter);
    }
    if (searchQuery) {
      result = filterBySearchQuery(result, searchQuery);
    }
    setCurrentStock(result);
  }, [stock, searchQuery, categoryFilter]);

  // returns stock filtered by selected catgory
  const filterByCategory = (stock, category) => {
    const filteredStock = stock.filter((item) => item.category === category);
    return filteredStock;
  };

  // returns stock filtered by match to searchQuery
  const filterBySearchQuery = (stock, searchQuery) => {
    const filteredStock = searchQuery
      ? stock.filter((item) => {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase());
        })
      : stock;
    return filteredStock;
  };

  // set the stock to the API return value (called once on init)
  const fetchData = async () => {
    const items = await getItems();
    setStock(items);
    setCurrentStock(items);
    console.log(items);
  };

  // update searchQuery from user input form
  const updateSearchQuery = (string) => {
    setSearchQuery(string);
  };

  // order stock based on rating descending
  const sortHighRating = () => {
    const sorted = [...currentStock].sort(
      (a, b) => b.rating.rate - a.rating.rate
    );
    setCurrentStock(sorted);
  };

  // order stock based on rating ascending
  const sortLowRating = () => {
    const sorted = [...currentStock].sort(
      (a, b) => a.rating.rate - b.rating.rate
    );
    setCurrentStock(sorted);
  };

  // order stock based on price descending
  const sortHighPrice = () => {
    const sorted = [...currentStock].sort((a, b) => b.price - a.price);
    setCurrentStock(sorted);
  };

  // order stock based on price acending
  const sortLowPrice = () => {
    const sorted = [...currentStock].sort((a, b) => a.price - b.price);
    setCurrentStock(sorted);
  };

  // add item to cart
  const addItemToCart = (item) => {
    setCart([...cart, item]);
  };

  // return JSX element
  return (
    <>
      <NavBar
        stock={stock}
        cart={cart}
        sortHighRating={sortHighRating}
        sortLowRating={sortLowRating}
        sortHighPrice={sortHighPrice}
        sortLowPrice={sortLowPrice}
        setCategoryFilter={setCategoryFilter}
        updateSearchQuery={updateSearchQuery}
        searchQuery={searchQuery}
      />
      <div className="itemGrid">
        {currentStock.map((item) => {
          return (
            <ItemCard item={item} addItemToCart={addItemToCart} key={item.id} />
          );
        })}
      </div>
    </>
  );
}

export default App;
