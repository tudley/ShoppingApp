import BasketItemCard from "./BasketItemCard";

const Basket = ({
  cart,
  stock,
  returnCartLength,
  handleAddToCart,
  decrementOrderByOne,
}) => {
  const totalCost = (cart) => {
    let total = 0;
    cart.forEach((item) => (total += item.price));
    return total;
  };

  return (
    <div className="basketDropDown">
      <a href="">Your Cart ({returnCartLength()}): </a>

      {cart.map((item) => {
        return (
          <BasketItemCard
            cart={cart}
            cartItem={item}
            stock={stock}
            handleAddToCart={handleAddToCart}
            decrementOrderByOne={decrementOrderByOne}
          />
        );
      })}

      <div className="basketItem">
        <span className="itemTitle">Total:</span>
        <span className="itemPrice">{totalCost(cart)}</span>
      </div>
    </div>
  );
};

export default Basket;
