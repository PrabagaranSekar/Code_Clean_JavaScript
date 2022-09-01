import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { MovieDetails } from "../model/movie-rating-detail";

@Injectable({
    providedIn: 'root'
})
export class MovieDetailsService {

    private firstMovieDetail: Subject<MovieDetails> = new Subject<MovieDetails>();

    private secondMovieDetail: Subject<MovieDetails> = new Subject<MovieDetails>();

    //getter 
    public getFirstMovieDetail(): Observable<MovieDetails> {
        return this.firstMovieDetail;
    }

    public getSecondMovieDetail(): Observable<MovieDetails> {
        return this.secondMovieDetail;
    }

    //setter 
    public setFirstMovieDetail(detail: MovieDetails) {
        this.firstMovieDetail.next(detail);
    }

    public setSeconMovieDetail(detail: MovieDetails) {
        this.secondMovieDetail.next(detail);
    }


}