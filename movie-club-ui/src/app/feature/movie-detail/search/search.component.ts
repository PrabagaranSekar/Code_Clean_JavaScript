import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MOVIEINPUT } from '../../const/common-const';
import { MovieDetails } from '../../model/movie-rating-detail';
import { MovieData, RecentlySearchedMovie } from '../../model/MovieListModel';
import { MovieSearchService } from '../../services/movie-services';
import { WeeklyMovies } from '../../services/week-movies';
import { ColourCodeCheck } from './color-check.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends ColourCodeCheck implements OnInit {

  ready: boolean = false;
  displaySpinner: boolean = true;
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
    private formBuilder: FormBuilder) {
    super();
  }

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
    this.ready = true;
    this.displaySpinner = false;
  }

  //Method To Get Movie SuggestionList Based on Input
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

  //Method To Get Selected Movie Details
  public selectedMovie(imdbID: string, movieSide: number): void {
    this.displaySpinner = true;
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
      this.displaySpinner = false;
    })
  }

  //Method To Get Recently Searched Movie Details From Browser Memory
  public researchRecentMovieData(recentMovie: RecentlySearchedMovie): void {
    this.displaySpinner = true;
    combineLatest([this.movieSearchService.getMovieDetailByID(recentMovie.firstMovie.imdbID),
    this.movieSearchService.getMovieDetailByID(recentMovie.secondMovie.imdbID)]).pipe(debounceTime(500)).subscribe(([res1, res2]) => {
      this.firstMovieDetails = res1;
      this.isFirstMovieResponse = true;
      this.secondMovieDetails = res2;
      this.isSecondMovieResponse = true;
      this.movieFormControl['firstMovie'].setValue(recentMovie.firstMovie);
      this.movieFormControl['secondMovie'].setValue(recentMovie.secondMovie);
      this.setRecentMovieInLocal();
      this.displaySpinner = false;
    })
  }


  //Method To Get Movie Values(i.e Title, IMDBRating etc)
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

  //Getter method to get FormControl Value
  get movieFormControl() {
    return this.movieFormGroup.controls;
  }

  //Method to Hide Result Area when input cleared
  public searchCleared(movieSide: number): void {
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

  //Setter Method to set Recently Searched Movies in Browser Menmory
  //Note : Recently Searched Movie Details will Cleared when Browser Cache Cleared
  private setRecentMovieInLocal(): void {
    if (this.movieFormGroup.valid && this.recentlySearchedMovies) {
      let newSearchMovie: RecentlySearchedMovie = {
        firstMovie: this.firstMovieDetails,
        secondMovie: this.secondMovieDetails
      }
      let firstMovieName = this.movieFormControl['firstMovie'].value.Title;
      let secondMovieName = this.movieFormControl['secondMovie'].value.Title;
      if (this.recentlySearchedMovies.length > 0) {
        //Check whether Movie already Searched or not
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
}
