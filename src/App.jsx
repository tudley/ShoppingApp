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

/*-------------------NEw FUNCTIONS---------------------------------*/

const updateCart = (action, item) => {
  const hasSize = item.size !== undefined && item.size !== null;

  if (action === "adding") {
    const itemInStock = stock.find(
      (s) =>
        s.id === item.id &&
        (!hasSize ? s.stock > 0 : s.size[item.size] > 0)
    );

    if (itemInStock) {
      updateStock("decrease", item, hasSize);
      updateCartItems("add", item, hasSize);
    }
  } else if (action === "subtracting") {
    const itemInCart = cart.find(
      (c) => c.id === item.id && (!hasSize || c.size === item.size)
    );

    if (itemInCart) {
      updateStock("increase", item, hasSize);
      updateCartItems("subtract", item, hasSize);
    }
  }
};

const updateStock = (direction, item, hasSize) => {
  const updated = stock.map((s) => {
    if (s.id !== item.id) return s;

    if (!hasSize) {
      return {
        ...s,
        stock: direction === "increase" ? s.stock + 1 : s.stock - 1,
      };
    }

    return {
      ...s,
      stock: {
        ...s.size,
        [item.size]: direction === "increase"
          ? s.stock[item.size] + 1
          : s.stock[item.size] - 1,
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
    );

    if (exists) {
      updated = cart.map((c) => {
        if (c.id === item.id && (!hasSize || c.size === item.size)) {
          return { ...c, qty: c.qty + 1 };
        }
        return c;
      });
    } else {
      const newItem = {
        id: item.id,
        title: item.title,
        size: item.size,
        qty: 1,
        price: item.price,
        img: item.img,
      };
      updated = [...cart, newItem];
    }

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


  // // add item to cart
  // const updateCart = (item, selectedSize = null) => {
  //   // if item is not in cart, create new entry, otherwise increment qty by 1

  //   if (
  //     cart.find(
  //       (currentItem) =>
  //         currentItem.id === item.id && currentItem.size === selectedSize
  //     )
  //   ) {
  //     // item is already in cart
  //     const updatedCart = cart.map((currentItem) => {
  //       currentItem.id === item.id && currentItem.qty++;
  //       return currentItem;
  //     });
  //     setCart(updatedCart);
  //   } else {
  //     // create a new entry in the cart
  //     const cartItem = {
  //       title: item.title,
  //       price: item.price,
  //       id: item.id,
  //       size: selectedSize,
  //       qty: 1,
  //       image: item.image,
  //     };
  //     setCart([...cart, cartItem]);
  //   }
  // };

  // const handleAddToCart = (item, selectedSize = null) => {
  //   // loop thruogh each item, if item is selected item, decrement item stock in selected confoguration by one, and add the item to the cart
  //   // create updatedStock array
  //   const updatedStock = stock.map((currentItem) => {
  //     if (currentItem.id === item.id) {
  //       // currentItem equals the item in the argument
  //       if (typeof currentItem.stock === "object") {
  //         // item has distinct sizes
  //         if (currentItem.stock[selectedSize] < 1) {
  //           // item is out of stock
  //           return currentItem;
  //         } else {
  //           // clothing item is in stock
  //           const updatedItem = {
  //             // decrement items stock
  //             ...currentItem,
  //             stock: {
  //               ...currentItem.stock,
  //               [selectedSize]: currentItem.stock[selectedSize] - 1,
  //             },
  //           };
  //           console.log(
  //             "clothing item recognised, stock decremented, cart updating."
  //           );
  //           updateCart(currentItem, selectedSize); // update customers basket
  //           return updatedItem;
  //         }
  //       } else {
  //         // item with one size
  //         if (currentItem.stock < 1) {
  //           //item out of stock
  //           return item;
  //         } else {
  //           // item in stock
  //           const updatedItem = {
  //             ...currentItem,
  //             stock: currentItem.stock - 1,
  //           }; //decrement item stock by one
  //           console.log(
  //             "non clothing item recognised, stock decremented, cart updating."
  //           );
  //           updateCart(currentItem); // update customers basket
  //           return updatedItem;
  //         }
  //       }
  //     } else {
  //       // curretItem doesnt match item argument, return unchanged item
  //       return currentItem;
  //     }
  //   });
  //   setStock(updatedStock);
  // };

  // /*--------------------------------------------------*/

  // const incrementStock = (cartItem, amount) => {
  //   const updatedStock = stock.map((item) => {
  //     if (item.id === cartItem.id) {
  //       if (typeof item.stock === "object") {
  //         // object stock is an object
  //         const updatedItem = {
  //           ...item,
  //           stock: {
  //             ...item.stock,
  //             [cartItem.size]: item.stock[cartItem.size] + amount,
  //           },
  //         };
  //         return updatedItem;
  //       } else {
  //         const updatedItem = { ...item, stock: item.stock + amount };
  //         return updatedItem;
  //       }
  //     } else {
  //       return item;
  //     }
  //   });
  //   setStock(updatedStock);
  // };

  // const decrementOrderByOne = (cartItem) => {
  //   // decrement cart item by 1, and if 0, remove entry from cart. Then increment stock item's stock by one
  //   console.log("decrementOrderByOne called:");
  //   const updatedCart = cart
  //     .map((currentCartItem) => {
  //       if (
  //         currentCartItem.id === cartItem.id &&
  //         currentCartItem.size === cartItem.size
  //       ) {
  //         if (cartItem.qty === 1) {
  //           console.log(
  //             "only one of the item is in the cart, so entry must be removed from cart"
  //           );
  //           incrementStock(cartItem, 1);
  //           return null;
  //         } else {
  //           console.log(
  //             "more then one in the cart, so just count down by one "
  //           );
  //           const updatedCartItem = {
  //             ...currentCartItem,
  //             qty: currentCartItem.qty - 1,
  //           };
  //           incrementStock(cartItem, 1);
  //           return updatedCartItem;
  //         }
  //       } else {
  //         return currentCartItem;
  //       }
  //     })
  //     .filter((item) => item !== null);
  //   setCart(updatedCart);
  // };



  /*-------------------------------------------*/

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
        //handleAddToCart={handleAddToCart}
        //decrementOrderByOne={decrementOrderByOne}

      />
      <div className="itemGrid">
        {currentStock.map((item) => {
          return (
            <ItemCard
              item={item}
              updateCart={updateCart}
              //handleAddToCart={handleAddToCart}
              key={item.id}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
