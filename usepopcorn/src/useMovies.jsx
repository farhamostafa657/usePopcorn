import { useEffect, useState } from "react";
const key = "94cb36f0";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&s=${query}
          `,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("something went wrong with fetching movies");
        const data = await res.json();
        if (data.Response === "False")
          throw new Error("cannot find this movie");
        setMovies(data.Search);
        setIsLoading(false);
      } catch (error) {
        if (!error === "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) return setMovies([]);
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
