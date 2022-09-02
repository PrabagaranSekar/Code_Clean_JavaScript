import axios from "axios";

// fetch movies based on user's search term
export const fetchRelatedMovies = async (movieName) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "4608549e",
      s: movieName,
    },
  });
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

export const fetchMovieDetail = async (movieImdbId) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "4608549e",
      i: movieImdbId,
    },
  });
  return response;
};
