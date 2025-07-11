import { useState } from "react";

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

export default SortSelector;
