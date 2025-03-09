import { use, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocaLStorageState } from "./useLocalStorageState";

const key = "94cb36f0";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocaLStorageState([], "watched");

  function handleSelectedMovie(id) {
    setSelectedId(selectedId == id ? null : id);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <Movies movies={movies} />} */}
          {!isLoading && !error && (
            <Movies movies={movies} onSelecteMovie={handleSelectedMovie} />
          )}
          {isLoading && !error && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handleCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleWatchedMovie}
              watched={watched}
              setWatched={setWatched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <ul className="list">
                {watched.map((movie) => (
                  <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onDeleteMovie={handleDeleteWatchedMovie}
                  />
                ))}
              </ul>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(() => {
    function callBack(e) {
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }

    document.addEventListener("keydown", callBack);
    return () => document.removeEventListener("keydown", callBack);
  }, [setQuery]);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchedMoviList() {

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <Summary watched={watched} />

//           <ul className="list">
//             {watched.map((movie) => (
//               <WatchedMovie movie={movie} key={movie.imdbID} />
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// }

function Movies({ movies, onSelecteMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelecteMovie={onSelecteMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelecteMovie }) {
  return (
    <li onClick={() => onSelecteMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  handleCloseMovie,
  onAddWatchedMovie,
  watched,
  setWatched,
}) {
  const [movie, setMovie] = useState();
  const [loading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState("");
  const [isRated, setIsRated] = useState(false);
  const [watchedMovie, setWatchedMovie] = useState({});

  const countRef = useRef(0);

  function handleAddMovie() {
    const newMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
      userRating,
      userRatingDesion: countRef.current,
    };
    if (watchedMovie.imdbID) {
      watchedMovie.userRating = userRating;
      handleCloseMovie();
      console.log("rated");
    } else {
      onAddWatchedMovie(newMovie);
      handleCloseMovie();
    }
    console.log("clicked");
  }

  useEffect(() => {
    if (userRating) countRef.current = countRef.current + 1;
  }, [userRating]);
  useEffect(() => {
    async function getMovie() {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
      );
      let data = await res.json();
      console.log(data);
      setMovie(data);
      setIsLoading(false);
    }
    function hadnleRatedMovies() {
      watched.map((movie) => {
        if (movie.imdbID == selectedId) {
          setWatchedMovie(movie);
          setIsRated(true);
        }
      });
    }
    hadnleRatedMovies();

    getMovie();
  }, [selectedId]);

  useEffect(() => {
    if (!movie?.Title) return;
    document.title = `movie |${movie?.Title}`;

    return function () {
      document.title = "use popcorn";
      console.log(`clean up effect for movie ${movie?.Title}`);
      //clsure in js save the last state of the variable
    };
  }, [movie?.Title]);

  useEffect(() => {
    function callEvent(e) {
      if (e.code == "Escape") {
        handleCloseMovie();
        console.log("closed");
      }
    }

    document.addEventListener("keydown", callEvent);

    return function () {
      document.removeEventListener("keydown", callEvent);
    };
  }, [handleCloseMovie]);
  return (
    <div className="details">
      {loading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={movie.Poster} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <apan>⭐</apan>
                {movie.imdbRating} Imdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isRated ? (
                <StarRating
                  maxRating={10}
                  size={24}
                  defaultRating={watchedMovie.userRating}
                  onSetRating={setUserRating}
                />
              ) : (
                <StarRating
                  maxRating={10}
                  size={24}
                  onSetRating={setUserRating}
                />
              )}

              {userRating && (
                <button className="btn-add" onClick={handleAddMovie}>
                  {watchedMovie.imdbID ? "change rating" : "+ add movie"}
                </button>
              )}
            </div>
            <p>{movie.Plot}</p>
            <p>Starring {movie.actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onDeleteMovie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteMovie(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}
