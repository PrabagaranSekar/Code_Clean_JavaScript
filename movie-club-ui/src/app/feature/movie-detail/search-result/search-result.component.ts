import { Component, Input, OnInit } from '@angular/core';
import { MovieDetails } from '../../model/movie-rating-detail';
import { MovieDetailsService } from '../../services/movie-detail';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  isReady:boolean=false;

  firstMovieDetail: MovieDetails;
  secondMovieDetail: MovieDetails;

  constructor(private movieDetailService: MovieDetailsService) { }

  ngOnInit(): void {
    this.movieDetailService.getFirstMovieDetail().subscribe(response => {
      this.firstMovieDetail = response;
      this.isReady=true
    })
    this.movieDetailService.getSecondMovieDetail().subscribe(response => {
      this.secondMovieDetail = response;
      this.isReady=true;
    })

    console.log(this.firstMovieDetail);
    console.log(this.secondMovieDetail);
  }

}
