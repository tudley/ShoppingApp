const BasketItemCard = ({ cartItem, updateCart, removeItemFromBasket }) => {
  const formatTitleString = (item) => {
    return item.title.length > 30
      ? item.title.slice(0, 26) + "..."
      : item.title;
  };

  return (
    <div className="basketItem">
      <img src={cartItem.image} alt={cartItem.title} className="basketImg" />
      <div className="basketInfo">
        <p className="basketTitle">{formatTitleString(cartItem)}</p>
        <p className="basketSize">Size : {cartItem.size}</p>
        <p className="basketQty">Qty : {cartItem.qty}</p>
        <p className="basketPrice">
          £{cartItem.price} x {cartItem.qty} = £{cartItem.price * cartItem.qty}
        </p>
      </div>
      <div className="basketControls">
        <button onClick={() => updateCart("subtracting", cartItem)}>-</button>
        <span>{cartItem.qty}</span>
        <button onClick={() => updateCart("adding", cartItem)}>+</button>
        <button
          className="deleteBtn"
          onClick={() => removeItemFromBasket(cartItem)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default BasketItemCard;
