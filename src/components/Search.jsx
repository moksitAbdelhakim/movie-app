const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="/src/assets/icons/search.svg" alt="Search Icon" />
        <input
          type="text"
          placeholder="Search through 300+ movies online"
          aria-label="Search through 300+ movies online"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
