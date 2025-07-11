const FilterSelector = ({ stock, setCategoryFilter }) => {
  const categories = [...new Set(stock.map((item) => item.category))];

  return (
    <div className="filterSelector">
      {categories.map((category) => {
        return (
          <button onClick={() => setCategoryFilter(category)}>
            {category}
          </button>
        );
      })}
      <button onClick={() => setCategoryFilter(null)}>Reset Filter</button>
    </div>
  );
};

export default FilterSelector;
