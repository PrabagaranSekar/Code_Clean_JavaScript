import {
  HttpClient
} from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  startWith,
  Subject
} from 'rxjs';
import {
  MOVIEINPUT,
  SCORECODE
} from '../../const/common-const';
import {
  MovieDetails
} from '../../model/movie-rating-detail';
import {
  MovieData,
  RecentlySearchedMovie
} from '../../model/MovieListModel';
import {
  MovieDetailsService
} from '../../services/movie-detail';
import {
  MovieSearchService
} from '../../services/movie-services';
import {
  debounceTime,
  throwIfEmpty
} from 'rxjs/operators';
import {
  WeeklyMovies
} from '../../services/week-movies';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  ready: boolean = false;
  movieFormGroup: FormGroup;

  //inputKey
  movieSearchKeyword: string = 'Title';

  // data: any;
  errorMsg: string;
  isLoadingResult: boolean;

  // firstMovieName: string;
  // secondMovieName: string;

  isFirstMovieResponse: boolean = false;
  isSecondMovieResponse: boolean = false;

  // firstMovieSuggestionList
  firstMovieSuggestionList: Array<MovieData>;
  secondMovieSuggestionList: Array<MovieData>;

  //MovieDetails
  firstMovieDetails: MovieDetails;
  secondMovieDetails: MovieDetails;

  //Recently Searched Movie List
  recentlySearchedMovies: Array<RecentlySearchedMovie> = []

  weeklyHotMovies: Array<RecentlySearchedMovie> = []

  movieDetailKeys: Array<string> = ['Movie Winning Percentage', 'Awards', 'BoxOffice', 'Metascore', 'imdbRating', 'imdbVotes']

  constructor(private movieSearchService: MovieSearchService,
    private formBuilder: FormBuilder,
    private movieDetailService: MovieDetailsService) { }
  ngOnInit(): void {

    this.movieFormGroup = this.formBuilder.group({
      firstMovie: ['', Validators.required],
      secondMovie: ['', Validators.required]
    })
    //Get Recently Searched Movies
    let localStoredMovie = JSON.parse(localStorage.getItem('recentMovies'));
    this.recentlySearchedMovies = localStoredMovie == null ? [] : localStoredMovie;

    //HOTMOVIES(WEEK)
    this.weeklyHotMovies = WeeklyMovies;
    this.ready = true
  }


  public getMovieSuggestionList(movieName: any, movieSide: number): void {
    this.isLoadingResult = true;
    this.movieSearchService.getMovieByName(movieName).pipe(debounceTime(500)).subscribe(data => {
      if (data['Search'] == undefined) {
        switch (movieSide) {
          case MOVIEINPUT.FIRST:
            this.firstMovieSuggestionList = [];
            break;
          case MOVIEINPUT.SECOND:
            this.secondMovieSuggestionList = [];
            break;
        }
        this.errorMsg = data['Error'];
      } else {
        switch (movieSide) {
          case MOVIEINPUT.FIRST:
            //Remove Duplicate value
            if (this.secondMovieDetails) {
              data['Search'].splice(data['Search'].findIndex(val => val.imdbID === this.secondMovieDetails.imdbID), 1);
            }
            this.firstMovieSuggestionList = data['Search'];
            break;
          case MOVIEINPUT.SECOND:
            //Remove Duplicate value
            if (this.firstMovieDetails) {
              data['Search'].splice(data['Search'].findIndex(val => val.imdbID === this.firstMovieDetails.imdbID), 1);
            }
            this.secondMovieSuggestionList = data['Search'];
            break;
        }
      }
      this.isLoadingResult = false;
    });
  }

  get movieFormControl() {
    return this.movieFormGroup.controls;
  }

  public getMovieDetailValues(key, movieSide: number): string {
    switch (movieSide) {
      case MOVIEINPUT.FIRST:
        return this.firstMovieDetails[key];
      case MOVIEINPUT.SECOND:
        return this.secondMovieDetails[key];
      default:
        return 'N/A';
    }
  }



  searchCleared(movieSide: number) {
    switch (movieSide) {
      case MOVIEINPUT.FIRST:
        this.isFirstMovieResponse = false;
        this.firstMovieDetails = null;
        break
      case MOVIEINPUT.SECOND:
        this.isSecondMovieResponse = false;
        this.secondMovieDetails = null;
        break
    }
  }

  selectedMovie(imdbID: string, movieSide: number): void {
    this.movieSearchService.getMovieDetailByID(imdbID).pipe(debounceTime(500)).subscribe(res => {
      switch (movieSide) {
        case MOVIEINPUT.FIRST:
          this.firstMovieDetails = res;
          this.isFirstMovieResponse = true;
          break;
        case MOVIEINPUT.SECOND:
          this.secondMovieDetails = res;
          this.isSecondMovieResponse = true;
          break;
      }
      this.setRecentMovieInLocal();

    })

  }

  onChangeSearch(val: string) { }

  onFocused(e) { }

  public researchRecentMovieData(recentMovie: RecentlySearchedMovie) {
    combineLatest([this.movieSearchService.getMovieDetailByID(recentMovie.firstMovie.imdbID),
    this.movieSearchService.getMovieDetailByID(recentMovie.secondMovie.imdbID)]).pipe(debounceTime(500)).subscribe(([res1, res2]) => {
      this.firstMovieDetails = res1;
      this.isFirstMovieResponse = true;
      this.secondMovieDetails = res2;
      this.isSecondMovieResponse = true;
      this.movieFormControl['firstMovie'].setValue(recentMovie.firstMovie);
      this.movieFormControl['secondMovie'].setValue(recentMovie.secondMovie);
      this.setRecentMovieInLocal();
    })
  }

  private setRecentMovieInLocal(): void {
    if (this.movieFormGroup.valid && this.recentlySearchedMovies) {
      let newSearchMovie: RecentlySearchedMovie = {
        firstMovie: this.firstMovieDetails,
        secondMovie: this.secondMovieDetails
      }
      let firstMovieName = this.movieFormControl['firstMovie'].value.Title;
      let secondMovieName = this.movieFormControl['secondMovie'].value.Title;
      if (this.recentlySearchedMovies.length > 0) {
        let alreadyChecked = this.recentlySearchedMovies.filter(a => (a.firstMovie.Title === firstMovieName ||
          a.firstMovie.Title === secondMovieName) &&
          (a.secondMovie.Title === firstMovieName ||
            a.secondMovie.Title === secondMovieName))
        if (alreadyChecked.length == 0) {
          if (this.recentlySearchedMovies.length > 4) {
            this.recentlySearchedMovies.splice(1, 1);
          }
          this.recentlySearchedMovies.push(newSearchMovie);
          localStorage.setItem('recentMovies', JSON.stringify(this.recentlySearchedMovies));
        }
      } else {
        this.recentlySearchedMovies.push(newSearchMovie);
        localStorage.setItem('recentMovies', JSON.stringify(this.recentlySearchedMovies));
      }
    }
  }


  public calculateMetaScore(metaScore): string {
    const movieMetaScore = parseInt(metaScore);
    if (movieMetaScore > 75) {
      return SCORECODE.HIGH;
    } else if (movieMetaScore > 50 && movieMetaScore <= 75) {
      return SCORECODE.AVERAGE;
    } else if (movieMetaScore <= 50) {
      return SCORECODE.BELOW_AVERAGE;
    } else {
      return SCORECODE.LOW;
    }
  }

  public getImdbRatingColor(imdbRating): string {
    const scoreNew = parseFloat(imdbRating);
    if (scoreNew > 7.5) {
      return SCORECODE.HIGH;
    } else if (scoreNew > 5 && scoreNew <= 7.5) {
      return SCORECODE.AVERAGE;
    } else if (scoreNew <= 5) {
      return SCORECODE.BELOW_AVERAGE;
    } else {
      return SCORECODE.LOW;
    }
  }

  public getBoxOfficeColor(boxOfficeCollection): string {
    let earningNew;
    if (boxOfficeCollection) {
      earningNew = boxOfficeCollection.substring(1).replaceAll(",", "");
    }
    if (earningNew > 75000000) {
      return SCORECODE.HIGH
    } else if (earningNew > 50000000 && earningNew <= 75000000) {
      return SCORECODE.AVERAGE;
    } else if (earningNew > 25000000 && earningNew <= 50000000) {
      return SCORECODE.BELOW_AVERAGE;
    } else {
      return SCORECODE.LOW;
    }
  }

  public getIMDBVotesColor(votes): string {
    if (votes) {
      votes = parseInt(votes.replaceAll(",", ""));
    }
    if (votes > 9000) {
      return SCORECODE.HIGH;
    } else if (votes > 5000 && votes <= 9000) {
      return SCORECODE.AVERAGE;
    } else if (votes > 4000 && votes <= 5000) {
      return SCORECODE.AVERAGE;
    } else {
      return SCORECODE.LOW;
    }
  }

  public getWinningPercentageColour(movieDetail: MovieDetails) {
    let percentage = this.calculateWiningPercentage(movieDetail);
    if (percentage > 70) {
      return SCORECODE.HIGH;
    } else if (percentage > 40 && percentage <= 70) {
      return SCORECODE.AVERAGE;
    } else if (percentage > 0 && percentage <= 40) {
      return SCORECODE.BELOW_AVERAGE;
    } else {
      return SCORECODE.LOW;
    }
  }

  public calculateWiningPercentage(movie: MovieDetails) {
    // let awardNomination = award.match(/\d+/g);
    let awardCount = 0;
    let nominationCount;
    //Movie have Both Awards & Nomination
    if (movie.Awards.toLowerCase().includes("wins") &&
      movie.Awards.toLowerCase().includes("nomination")) {
      const splitAwardDetails = movie.Awards.split('&');
      awardCount = awardCount + parseInt(splitAwardDetails[0].match(/\d+/g)[0]);
      nominationCount = parseInt(splitAwardDetails[1].match(/\d+/g)[0]);
    }
    if (nominationCount == undefined) {
      return 0;
    }
    //General common formulae to calculate winning percentage
    return Math.floor((awardCount / parseInt(nominationCount)) * 100);


  }
}
