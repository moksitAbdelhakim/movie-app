/**
 * A presentation component to display a movie card with its poster, title,
 * average rating, original language, and release year.
 *
 * @param {Object} movie
 * @prop {string} movie.poster_path - The path to the movie poster image.
 * @prop {string} movie.title - The title of the movie.
 * @prop {number} movie.vote_average - The average rating of the movie.
 * @prop {string} movie.original_language - The original language of the movie.
 * @prop {string} movie.release_date - The release date of the movie.
 *
 * @returns {ReactElement} A JSX element representing the movie card.
 */
const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img
        src={
          movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/src/assets/images/no-poster.png"
        }
        alt={movie.title}
      />
      <div className="mt-4">
        <h3>{movie.title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/src/assets/icons/star.svg" alt="Star Icon" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>

          <span>&bull;</span>

          <span className="lang">{movie.original_language}</span>

          <span>&bull;</span>

          <span className="year">{movie.release_date.split("-")[0]}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
