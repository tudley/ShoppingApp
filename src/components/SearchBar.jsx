const SearchBar = ({ searchQuery, updateSearchQuery }) => {
  return (
    <div>
      <form>
        <button type="submit">🔎</button>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search for an item..."
          onChange={(e) => updateSearchQuery(e.target.value)}
        ></input>
      </form>
    </div>
  );
};

export default SearchBar;
