import { useEffect, useState } from "react";
import { fetchMovies } from "./services/moviesApis";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

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

  useEffect(() => {
    // Fetch movies when the component mounts

    setIsLoading(true);
    setError(null); // Reset error state before fetching new data
    const fetchData = async () => {
      try {
        const movies = await fetchMovies(
          "/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc"
        );

        // For safety, we can check movies before setting state
        if (movies && movies.results) {
          console.log("Fetched movies:", movies.results);
          setMovies(movies?.results || []);
          setIsLoading(false);
        } else {
          console.error("No movies found in the response.");
          setError("No movies found. Please try again later!");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/logo.svg" alt="Logo" className="logo" />
          <img src="/src/assets/images/hero.png" alt="Hero Banner" />
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
