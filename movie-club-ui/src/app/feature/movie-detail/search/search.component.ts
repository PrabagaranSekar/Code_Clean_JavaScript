import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, map, Observable, startWith, Subject } from 'rxjs';
import { MOVIEINPUT } from '../../const/common-const';
import { MovieDetails } from '../../model/movie-rating-detail';
import { MovieData } from '../../model/MovieListModel';
import { MovieDetailsService } from '../../services/movie-detail';
import { MovieSearchService } from '../../services/movie-services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  //inputKey
  movieSearchKeyword: string = 'Title';

  // data: any;
  errorMsg: string;
  isLoadingResult: boolean;

  firstMovieName: string;
  secondMovieName: string;

  isFirstMovieResponse: boolean = false;
  isSecondMovieResponse: boolean = false;

  // firstMovieSuggestionList
  firstMovieSuggestionList: Array<MovieData>;
  secondMovieSuggestionList: Array<MovieData>;

  //MovieDetails
  firstMovieDetails: MovieDetails;
  secondMovieDetails: MovieDetails;

  ngOnInit(): void {
  }

  constructor(private movieSearchService: MovieSearchService, private movieDetailService: MovieDetailsService) {
  }


  public getMovieSuggestionList(movieName: string, movieSide: number): void {
    this.isLoadingResult = true;
    this.movieSearchService.getMovieByName(movieName).subscribe(data => {
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
          case MOVIEINPUT.SECOND:
            this.secondMovieSuggestionList = data['Search'];
            break;
          case MOVIEINPUT.FIRST:
            this.firstMovieSuggestionList = data['Search'];
            break;

        }

      }
      this.isLoadingResult = false;
    });
  }



  searchCleared() {
    console.log('searchCleared');
  }

  selectedMovie(movieDetail: MovieData, movieSide: number) {
    this.movieSearchService.getMovieDetailByID(movieDetail.imdbID).subscribe(res => {
      switch (movieSide) {
        case MOVIEINPUT.FIRST:
          this.movieDetailService.setFirstMovieDetail(res);
          this.firstMovieDetails = res;
          this.isFirstMovieResponse = true;
          break;
        case MOVIEINPUT.SECOND:
          this.movieDetailService.setSeconMovieDetail(res);
          this.secondMovieDetails = res;
          this.isSecondMovieResponse = true;
          break;

      }
      console.log(res);
    })
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }


  public calculateMetaScore(movieDetail): string {
    const movieMetaScore = parseInt(movieDetail.Metascore);
    if (movieMetaScore === undefined || isNaN(movieMetaScore)) {
      return " #e5e4e2";
    } else if (movieMetaScore <= 50) {
      return "#e9537f";
    } else if (movieMetaScore > 50 && movieMetaScore <= 75) {
      return "8f8fee";
    } else {
      return "#00d1b2";
    }
  }

  public getImdbRatingColor(imdbRating): string {
    const scoreNew = parseFloat(imdbRating);
    if (scoreNew === undefined || isNaN(scoreNew)) {
      return "#e5e4e2";
    } else if (scoreNew <= 5) {
      return "#e9537f";
    } else if (scoreNew > 5 && scoreNew <= 7.5) {
      return "#8f8fee";
    } else {
      return "#00d1b2";
    }
  }

  public getBoxOfficeColor(boxOfficeCollection): string {
    let earningNew;
    if (boxOfficeCollection) {
      earningNew = boxOfficeCollection.substring(1).replaceAll(",", "");
    }
    if (earningNew <= 50000000) {
      return "#e9537f";
    } else if (earningNew > 50000000 && earningNew <= 100000000) {
      return "#8f8fee";
    } else {
      return "#00d1b2";
    }
  }

  public getIMDBVotesColor(votes){
    if(votes){
      votes = parseInt(votes.replaceAll(",",""));
    }
    if (votes <= 4000) {
      return "#e9537f";
    } else if (votes > 4000 && votes <= 10000) {
      return "#8f8fee";
    } else {
      return "#00d1b2";
    }
  }
}


