import { useEffect, useState } from "react";
import { fetchPopularMovies, searchMovies, fetchTrendingMovies, logSearchTerm } from "./services/apis.js";
import { useDebounce } from "./hooks/useDebounce";

import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import hero from "./assets/images/hero.png";
import arrowRight from "./assets/icons/arrow-right.svg";
import arrowLeft from "./assets/icons/arrow-left.svg";

/**
 * The root component of the application, responsible for managing state and rendering the main layout.
 *
 * @returns {ReactElement} The JSX element representing the root component.
 */
const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [counts, setCounts] = useState({
    totalPages: 0,
    totalResults: 0,
  });

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const fetchMovies = async (fetchFn, signal) => {
    setIsLoading(true);
    setError(null); // Rest error state before fetching new data

    try {
      const movies = await fetchFn(signal);
      if (movies && movies.results) {
        setMovies(movies.results || []);
        setCurrentPage(movies.page || 1); // Ensure currentPage is set to the page from the response
        setCounts({
          totalPages: Math.min(movies.total_pages || 0, 50), // Limit to 50 pages for development.
          totalResults: Math.min(movies.total_results || 0, 1000), // Limit to 1000 results.
        });
        // Update the search term in Appwrite database
        if (searchTerm.trim() !== "" && movies.results.length > 0) {
          await logSearchTerm(searchTerm, movies.results[0]);
        }
      } else {
        console.error("No movies found in the response!");
        setError("No movies found in the response. Please try again later!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching movies, type:", error.name, "message:", error.message);
        setError("Failed to fetch movies. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch popular movies or search results based on the search term
  const getTrendsMovies = async (signal) => {
    try {
      const movies = await fetchTrendingMovies({ signal });
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies, type:", error.name, "message:", error.message);
    }
  };

  // Function to load more movies based on the current page and direction
  const loadMoreMovies = (direction) => {
    if (direction === "back" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else if (direction === "forward" && currentPage < counts.totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchMovies((signal) => fetchPopularMovies(currentPage, { signal }));
    } else {
      const controller = new AbortController();
      fetchMovies((signal) => searchMovies(searchTerm, currentPage, { signal }), controller.signal);
      return () => controller.abort();
    }
  }, [debouncedSearchTerm, currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    getTrendsMovies();
    return () => controller.abort();
  }, []);

  // Render the main application layout
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/logo.svg" alt="Logo" className="logo" />
          <img src={hero} alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You’ll Love Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <p> Check out the most popular movies right now!</p>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          <p>Discover a wide range of movies from various genres, including action, drama, comedy, and more.</p>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p className="text-white ">{error}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>

        <div className="pagination">
          {currentPage > 1 && (
            <button onClick={() => loadMoreMovies("back")} disabled={isLoading}>
              <img src={arrowLeft} alt="Load Previous" />
            </button>
          )}

          {counts.totalPages > 0 && (
            <p>
              {currentPage}
              <span> / {counts.totalPages} </span>
            </p>
          )}

          {counts.totalPages > 0 && currentPage < counts.totalPages && (
            <button onClick={() => loadMoreMovies("forward")} disabled={isLoading}>
              <img src={arrowRight} alt="Load More" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
