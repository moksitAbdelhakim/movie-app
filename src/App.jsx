import { useEffect, useState } from "react";
import { fetchPopularMovies, fetchMoviesBySearch } from "./services/moviesApis";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

import hero from "./assets/images/hero.png";

/**
 * The root component of the application, which renders a full-screen
 * background pattern.
 *
 * @returns {ReactElement} The JSX element representing the root component.
 */
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (fetchFn, signal) => {
    setIsLoading(true);
    setError(null); // Rest error state before fetching new data
    try {
      const movies = await fetchFn(signal);
      if (movies && movies.results) {
        setMovies(movies.results || []);
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchMovies((signal) =>
        fetchPopularMovies(
          "/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
          { signal }
        )
      );
    } else {
      const controller = new AbortController();
      fetchMovies((signal) => fetchMoviesBySearch(searchTerm, { signal }), controller.signal);
      return () => controller.abort();
    }
  }, [searchTerm]);

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
      </div>
    </main>
  );
};

export default App;
