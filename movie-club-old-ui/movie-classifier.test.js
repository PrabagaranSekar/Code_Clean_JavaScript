const data = require("./fake_movies.json");
const { groupMoviesByGenre } = require("./movie-classifier");

describe("movie-classifier", () => {
  it("should classify movies based on genres", () => {
    const movies = data.movies;
    const genres = data.genres;
    const moviesByGenre = groupMoviesByGenre(data);
    const noOfGenresInMoviesBGenre = Object.keys(moviesByGenre).length;
    expect(noOfGenresInMoviesBGenre).toBe(genres.length);
  });
});
