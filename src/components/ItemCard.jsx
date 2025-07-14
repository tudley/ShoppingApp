import { useState } from "react";

const ItemCard = ({ 
  item, 
  //handleAddToCart,
  updateCart,
 }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const descriptionString = showFullDescription
    ? item.description
    : item.description.length > 50
    ? item.description.slice(0, 50) + "..."
    : item.description;

  const ratingToString = (rating) => {
    let ratingString = "";
    const intRating = Math.round(rating);
    for (let i = 0; i < intRating; i++) {
      ratingString += "⭐";
    }
    return ratingString;
  };

  const stockToString = (item) => {
    let string;
    if (item.category.includes("clothing")) {
      // item has sizes
      if (selectedSize === null) {
        // size has not been selected
        string = "Select a size to see if it's in stock...";
      } else {
        // size has bee selected
        if (item.stock[selectedSize] === 0) {
          // size is out of stock
          string = "Out of Stock";
        } else {
          // size is in stock
          string = `Stock: ${item.stock[selectedSize]}`;
        }
      }
    } else {
      // item has no sizes
      if (item.stock === 0) {
        // item is out of stock
        string = `Out of Stock`;
      } else {
        // item is in stock
        string = `Stock: ${item.stock}`;
      }
    }
    return string;
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
          <p>
            {ratingToString(item.rating.rate) + item.rating.count + " reviews"}
          </p>
          {item.category.includes("clothing") && (
            <>
              <label htmlfor="size">Select a size:</label>
              <select
                id="size"
                name="size"
                onChange={(e) => {
                  handleSizeSelect(e.target.value);
                }}
              >
                {Object.keys(item.stock).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </>
          )}
          <p>{stockToString(item)}</p>
          <button
            className="buyButton"
            onClick={() => {
              if (item.category.includes("clothing") && selectedSize === null) return;
              const itemToAdd = {...item, size : selectedSize}
              updateCart('adding', itemToAdd)}}
          >
            {item.stock[selectedSize] === 0
              ? "Unable to add to cart"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ItemCard;
