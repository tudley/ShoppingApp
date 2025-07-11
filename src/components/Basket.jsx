const Basket = ({ cart }) => {
  const formatTitleString = (item) => {
    return item.title.length > 30
      ? item.title.slice(0, 16) + "..."
      : item.title;
  };

  return (
    <div className="basketDropDown">
      <p>Cart: </p>
      <ul>
        {cart.map((item) => {
          return <li>{formatTitleString(item)}</li>;
        })}
      </ul>
    </div>
  );
};

export default Basket;
