import BasketItemCard from "./BasketItemCard";

const Basket = ({
  cart,
  stock,
  returnCartLength,
  updateCart,
  removeItemFromBasket,
}) => {
  const totalCost = (cart) => {
    let total = 0;
    cart.forEach((item) => (total += item.price * item.qty));
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
            updateCart={updateCart}
            removeItemFromBasket={removeItemFromBasket}
          />
        );
      })}

      <div className="basketItem">
        <div className="basketItemLeft">
          <span className="basketTitle">Total : </span>
          <span className="basketPrice">£{totalCost(cart)}</span>
        </div>
        <div className="basketItemRight">
          <span className="checkoutButton">
            <button>Proceed to checkout</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Basket;
