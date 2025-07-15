const updateCart = (method, cartItems, cartItem, stock) => {
  // adding:
  // check what kind of item we are using

  const type = typeof cartItem.size;
  if (method === "adding") {
    let inStock;
    if (type == null) {
      // determines if item is in stock, regardless of object structure
      inStock = stock.filter(
        (element) => element.id === cartItem.id && element.stock > 0
      );
    } else {
      inStock = stock.filter(
        (element) =>
          element.id === cartItem.id && element.size[cartItem.size] > 0
      );
    }
    if (inStock.length > 0) {
      // if inStock, ammend stock and cart
      amendStock("subtract", type, stock, cartItem);
      amendCart("add", type, cartItems, cartItem);
    }
  } else if (method === "subtracting") {
    let itemIsInCart;
    if (type == null) {
      itemIsInCart = cartItems.filter((item) => item.id === cartItem.id);
    } else {
      itemIsInCart = cartItems.filter(
        (item) => item.id === cartItem.id && item.size === cartItem.size
      );
    }
    if (itemIsInCart.length > 0) {
      amendStock("add", type, stock, cartItem);
      amendCart("subtract", type, cartItems, cartItem);
    }
  }
};

// is item in stock? is does it have a size?
// if yes, decrement stock and add to cart
// if no, do nothing

// add to cart:
// does it exist in the cart?
// if not, create record, if yes, increment record

// subtracting :

// is item in cart mroe than onec?
// if yes, decrement, if no, remove item

// find item in stock and increment it
// then, add to stock

const amendStock = (method, type, stock, cartItem) => {
  // ammends stock, (does not check if in stock in case of subtracting)
  const updatedStock = stock.map((item) => {
    if (item.id === cartItem.id) {
      if (type == null) {
        if (method === "add") {
          const updatedItem = { ...item }; // adjust stock by one for sizeless object
          return updatedItem;
        } else if (method === "subtract") {
          if (item.qty === 0) {
            return null;
          } else {
            const updatedItem = { ...item }; // adjust stock by one for sizeless object
            return updatedItem;
          }
        }
      } else if (type === "Array") {
        if (method === "add") {
          const updatedItem = { ...item }; // adjust stock by one for sizeless object
          return updatedItem;
        } else if (method === "subtract") {
          const updatedItem = { ...item }; // adjust stock by one for sizeless object
          return updatedItem;
        }
      }
    } else {
      return item;
    }
  });
  setStock(updatedStock);
};

const amendCart = (method, type, cartItems, cartItem) => {
  // is item already in cart?
  let itemIsInCart;
  if (type == null) {
    itemIsInCart = cartItems.filter((item) => item.id === cartItem.id);
  } else {
    itemIsInCart = cartItems.filter(
      (item) => item.id === cartItem.id && item.size === cartItem.size
    );
  }
  const itemInCartQty = 2;
  // if add, check if in cart, if not, add new entry, is yes, increment
  if (method === "add") {
    if (itemIsInCart.length > 0) {
      const updatedCartItems = cartItems.map((item) => {
        if (type == null) {
          if (item.id === cartItem.id) {
            const updatedItem = { ...item }; // add one to stock
            return updatedItem;
          } else {
            return item;
          }
        } else if (type === "array") {
          if (item.id === cartItem.id && item.size === cartItem.size) {
            const updatedItem = { ...item }; // add one to stock
            return updatedItem;
          } else {
            return item;
          }
        }
      });
      setCart(updatedCartItems);
    } else {
      const newCartItem = {
        title: cartItem.title,
        size: cartItem.size,
        id: cartItem.id,
        qty: 1,
        price: cartItem.price,
        img: cartItem.img,
      };
      setCart([...cartItems, newCartItem]);
    }
  } else if (method === "subtract") {
    // is item in cart?
    if (itemIsInCart) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === cartItem.id && item.size === cartItem.size) {
          if (itemIsInCartQty === 1) {
            return null;
          } else {
            const updatedCartItem = { ...item, qty: item.qty - 1 };
            return updatedCartItem;
          }
        }
      });
      setCart(updatedCartItems);
    }
  }
};

const stock = [0, 2, 3];
const cart = [0, 1, 2];

const updateCartHandler = (action, item) => {
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

const updateStock = (direction, item, hasSize) => {
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
      size: {
        ...s.stock,
        [item.size]:
          direction === "increase"
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
        img: item.img,
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
