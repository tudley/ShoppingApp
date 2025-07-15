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

  /*----------------NEW <FUNCTIONS--------></FUNCTIONS-------->*/

  const updateCart = (action, item) => {
    const hasSize = item.size !== undefined && item.size !== null; // is the items size defined? (for when adding to basket from itemCard)
    if (action === "adding") {
      const itemInStock = stock.find(
        (s) =>
          s.id === item.id && (!hasSize ? s.stock > 0 : s.stock[item.size] > 0)
      ); // check if item is in stock, catches items that have sizes or not. [NOTE: IF ADDING TO CART FROM ITEMCARD, ONLY ALLOW BUY BUTTON IF SIZE IS SELECTED.]

      if (itemInStock) {
        updateStock("decrease", item, hasSize);
        updateCartItems("add", item, hasSize);
      }
    } else if (action === "subtracting") {
      const itemInCart = cart.find(
        (c) => c.id === item.id && (!hasSize || c.size === item.size)
      ); // check if the item is in the cart (mandatory for subtracting from the cart)

      if (itemInCart) {
        updateStock("increase", item, hasSize);
        updateCartItems("subtract", item, hasSize);
      }
    }
  };

  const updateStock = (direction, item, hasSize, qty = 1) => {
    const updated = stock.map((s) => {
      if (s.id !== item.id) return s; // if not match, return item

      if (!hasSize) {
        // if not hasSize, amend stock easy way
        return {
          ...s,
          stock: direction === "increase" ? s.stock + 1 : s.stock - 1,
        };
      }

      return {
        // else, hasSize, amend stock the hard way
        ...s,
        stock: {
          ...s.stock,
          [item.size]:
            direction === "increase"
              ? s.stock[item.size] + qty
              : s.stock[item.size] - qty,
        },
      };
    });

    setStock(updated);
  };

  const updateCartItems = (action, item, hasSize) => {
    let updated;

    if (action === "add") {
      const exists = cart.some(
        (c) => c.id === item.id && (!hasSize || c.size === item.size)
      ); // find if item is already in cart, for items with and without size

      if (exists) {
        // if item is in cart, increment one baed on hasSize.
        updated = cart.map((c) => {
          if (c.id === item.id && (!hasSize || c.size === item.size)) {
            return { ...c, qty: c.qty + 1 };
          }
          return c;
        });
      } else {
        // create new item to add to the cart
        const newItem = {
          id: item.id,
          title: item.title,
          size: item.size,
          qty: 1,
          price: item.price,
          image: item.image,
        };
        updated = [...cart, newItem];
      }

      // reduce() method.
    } else if (action === "subtract") {
      updated = cart.reduce((acc, c) => {
        if (c.id === item.id && (!hasSize || c.size === item.size)) {
          if (c.qty > 1) acc.push({ ...c, qty: c.qty - 1 });
        } else {
          acc.push(c);
        }
        return acc;
      }, []);
    }

    setCart(updated);
  };

  const removeItemFromBasket = (item) => {
    // identify item and hasSize flag
    const hasSize = item.size !== undefined && item.size !== null;
    const itemToRemove = cart.find(
      (c) => c.id === item.id && (!hasSize || c.size === item.size)
    );

    // update stock
    updateStock("increase", itemToRemove, hasSize, itemToRemove.qty);

    // update cart
    const updated = cart.reduce((acc, c) => {
      const isSameItem = c.id === item.id && (!hasSize || c.size === item.size);
      if (!isSameItem) {
        acc.push(c);
      }
      return acc;
    }, []);
    setCart(updated);
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
        updateCart={updateCart}
        removeItemFromBasket={removeItemFromBasket}
      />
      <div className="itemGrid">
        {currentStock.map((item) => {
          return <ItemCard item={item} updateCart={updateCart} key={item.id} />;
        })}
      </div>
    </>
  );
}

export default App;
