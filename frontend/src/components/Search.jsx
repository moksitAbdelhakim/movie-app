import searchIcon from "../assets/icons/search.svg";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src={searchIcon} alt="Search Icon" />
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
