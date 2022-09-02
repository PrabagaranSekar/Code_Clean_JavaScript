exports.groupMoviesByGenre = (data) => {
  let moviesbyGenre = {};
  for (let i = 0; i < data.movies.length; i++) {
    const allGenres = data.genres;
    let currentGenre;
    for (let j = 0; j < allGenres.length; j++) {
      if (allGenres[j].id == data.movies[i].genreId) {
        currentGenre = allGenres[j].name;
        break;
      }
    }
    if (moviesbyGenre[currentGenre] === undefined) {
      moviesbyGenre[currentGenre] = [data.movies[i].Title];
    } else {
      moviesbyGenre[currentGenre].push(data.movies[i].Title);
    }
  }
  return moviesbyGenre;
};
