const { default: axios } = require("axios");
const moviesData = require("./fake_movies.json");
const {
  getTotalNumberOFAwardsWon,
  calculateWinPercentage,
} = require("./awards");
const {
  getBoxOfficeColor,
  getImdbRatingColor,
  getMetaScoreColor,
} = require("./color-getter");
const { groupMoviesByGenre } = require("./movie-classifier");
const {
  getElementBy,
  hideElement,
  containsWithin,
  setInnerHtmlFor,
  clearElement: emptyTheElement,
  removeClass,
  addClass,
  addAsChildTo,
  createElement,
  setValueOnInput,
} = require("./services/dom.service");
const {
  fetchRelatedMovies,
  fetchMovieDetail,
} = require("./services/movie.service");

let leftMovie;
let rightMovie;

// action on user selects a movie from suggestions shown
const onMovieSelect = async (movie, summaryEl) => {
  const selectedMovie = await fetchMovieDetail(movie.imdbID);

  // hiding the tutorial div if user selects a movie
  hideElement(".tutorial");

  const parentElOfLeftSummary = getElementBy(".left");

  // setting movie in variables to verify for comparison both movies should be present
  if (containsWithin(parentElOfLeftSummary, summaryEl)) {
    leftMovie = selectedMovie;
  } else {
    rightMovie = selectedMovie;
  }

  setInnerHtmlFor(summaryEl, getSummaryToBeShown(selectedMovie.data));

  compareMovieStatistics();
};

// TODO: refactor a large function
const getSummaryToBeShown = (movieDetail) => {
  let dollarsEarned;
  if (movieDetail.BoxOffice) {
    dollarsEarned = movieDetail.BoxOffice.substring(1).replaceAll(",", "");
  }

  const metaScore = movieDetail.Metascore;
  const imdbRating = movieDetail.imdbRating;
  const imdbVotes = movieDetail.imdbVotes.replaceAll(",", "");

  const boxOfficeColor = getBoxOfficeColor(movieDetail.BoxOffice);
  const metascoreColor = getMetaScoreColor(metaScore);
  const imdbratingColor = getImdbRatingColor(imdbRating);

  const awardsReceived = getTotalNumberOFAwardsWon(movieDetail.Awards);

  const winPercentage = calculateWinPercentage(movieDetail.Awards);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" >
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary" data-stats=${awardsReceived} data-statsName="awards">
      <p class="title" >${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary" data-stats=${dollarsEarned} data-statsName="box office">
      <p class="title" style="color: ${boxOfficeColor}">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary" data-stats=${metaScore} data-statsName="metascore">
      <p class="title" style="color: ${metascoreColor}">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary" data-stats=${imdbRating} data-statsName="imdbRating">
      <p class="title" style="color: ${imdbratingColor}">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary" data-stats=${imdbVotes} data-statsName="votes">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
    <article class="notification is-primary" data-stats=${winPercentage} data-statsName="votes">
      <p class="title">${winPercentage}%</p>
      <p class="subtitle">Awards Winning Rate</p>
    </article>
  `;
};

// TODO: AutoComplete code has many issues
// It is repetitive and tightly coupled with movies object
// for only two auto completes we need to do so much duplication
// we want to extract autocomplete creation logic to autocomplete.js file
// so that it can be reused for anything like movies, students, users
const leftAutoComplete = getElementBy(".left-autocomplete");
const rightAutoComplete = getElementBy(".right-autocomplete");
setHtmlForAutoComplete = (autocomplete) => {
  setInnerHtmlFor(
    autocomplete,
    `
  <label><b>Search for a movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`
  );
};

setHtmlForAutoComplete(leftAutoComplete);
setHtmlForAutoComplete(rightAutoComplete);

// TODO: refactor to reduce the number of global variables
// left auto complete elements
const leftInput = getElementBy(".input", leftAutoComplete);
const leftDropdown = getElementBy(".dropdown", leftAutoComplete);
const leftResultsWrapper = getElementBy(".results", leftAutoComplete);
const leftSummary = getElementBy("#left-summary");

// right auto complete elements
const rightInput = getElementBy(".input", rightAutoComplete);
const rightDropdown = getElementBy(".dropdown", rightAutoComplete);
const rightResultsWrapper = getElementBy(".results", rightAutoComplete);
const rightSummary = getElementBy("#right-summary");

const fillAutoCompleteWithMoviesSuggestions = (
  movies,
  resultsWrapperEl,
  dropdownEl,
  inputEl,
  summaryEl
) => {
  emptyTheElement(resultsWrapperEl);

  if (!movies.length) {
    removeClass(dropdownEl, "is-active");
    return;
  }

  addClass(dropdownEl, "is-active");

  for (let movie of movies) {
    const imgSrc = movie.poster === "N/A" ? "" : movie.Poster;
    innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title}
    `;
    const option = createElement("a", innerHTML, "dropdown-item");

    option.addEventListener("click", () => {
      dropdownEl.classList.remove("is-active");
      setValueOnInput(inputEl, movie.Title);
      onMovieSelect(movie, summaryEl);
    });

    addAsChildTo(resultsWrapperEl, option);
  }
};

const showSuggestionsForMovies = async (filmName, autoCompleteSide) => {
  const movies = await fetchRelatedMovies(filmName);

  if (autoCompleteSide === "left") {
    fillAutoCompleteWithMoviesSuggestions(
      movies,
      leftResultsWrapper,
      leftDropdown,
      leftInput,
      leftSummary
    );
  } else {
    fillAutoCompleteWithMoviesSuggestions(
      movies,
      rightResultsWrapper,
      rightDropdown,
      rightInput,
      rightSummary
    );
  }
};

// TODO: debounce timer logic can be refactored and extracted to a new file utils.js
// so that it is loosely coupled and reusable in any project
let timerId;
const onInput = (event, autoCompleteSide) => {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    showSuggestionsForMovies(event.target.value, autoCompleteSide);
  }, 1000);
};

leftInput.addEventListener("input", (event) => onInput(event, "left"));
rightInput.addEventListener("input", (event) => onInput(event, "right"));

// to close dropdown if click anywhere else on screen
document.addEventListener("click", (event) => {
  if (!containsWithin(leftAutoComplete, event.target)) {
    removeClass(leftDropdown, "is-active");
  }
});
document.addEventListener("click", (event) => {
  if (!containsWithin(rightAutoComplete, event.target)) {
    removeClass(rightDropdown, "is-active");
  }
});

const compareMovieStatistics = () => {
  if (leftMovie && rightMovie) {
    const leftMovieStats = leftSummary.querySelectorAll("article.notification");
    const rightMovieStats = rightSummary.querySelectorAll(
      "article.notification"
    );
    for (let i = 0; i < leftMovieStats.length; i++) {
      const leftStatEl = leftMovieStats[i];
      const rightStatEl = rightMovieStats[i];
      const { stats: leftStats, statsname } = leftStatEl.dataset;
      const { stats: rightStats } = rightStatEl.dataset;
      const leftMovieStatValue = statsname.includes("imdb")
        ? parseFloat(leftStats)
        : parseInt(leftStats);
      const rightMovieStatValue = statsname.includes("imdb")
        ? parseFloat(rightStats)
        : parseInt(rightStats);

      if (rightMovieStatValue > leftMovieStatValue) {
        leftStatEl.classList.remove("is-primary");
        leftStatEl.classList.add("loser");
      } else if (rightMovieStatValue < leftMovieStatValue) {
        rightStatEl.classList.remove("is-primary");
        rightStatEl.classList.add("loser");
      }
    }
  }
};

//https://my-json-server.typicode.com/shah7014/mock_data/genres/2/movies
// TODO: can remove nested structure(using async await)
// TODO: can be moved to movies.service.js
function getLatestSeraches() {
  const ul = getElementBy(".links");
  axios
    .get("https://my-json-server.typicode.com/shah7014/mock_data/genres")
    .then((genres) => {
      const sortedGenres = genres.data.sort((a, b) => a.upVotes - b.upVotes);
      const topGenre = sortedGenres[sortedGenres.length - 1];
      axios
        .get(
          "https://my-json-server.typicode.com/shah7014/mock_data/genres/" +
            topGenre.id +
            "/movies"
        )
        .then((response) => {
          const movies = response.data;
          for (let i = 0; i < movies.length; i += 2) {
            innerHTML = `<a>${movies[i].Title} vs ${movies[i + 1].Title}</a>`;

            const li = createElement("li", innerHTML);

            addAsChildTo(ul, li);
            li.addEventListener("click", () => {
              onMovieSelect(movies[i], leftSummary);
              setValueOnInput(leftInput, movies[i].Title);
              setValueOnInput(rightInput, movies[i + 1].Title);
              onMovieSelect(movies[i + 1], rightSummary);
            });
          }
        });
    });
}

getLatestSeraches();

// TODO: can create a table for list of movies searhced by users with their genres
// with some mock data for now
const createTableForMoviesByGenre = () => {
  const moviesByGenre = groupMoviesByGenre(moviesData);
  console.log(moviesByGenre);
};

createTableForMoviesByGenre();
