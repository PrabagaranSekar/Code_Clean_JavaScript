import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APICONSTANT } from "../const/common-const";
import { MovieDetails } from "../model/movie-rating-detail";
import { MovieSearchList } from "../model/MovieListModel";

@Injectable({
    providedIn: 'root'
})
export class MovieSearchService {
    constructor(private httpClient: HttpClient) { }

    public getMovieByName(movieName: string): Observable<MovieSearchList> {
        return this.httpClient.get<MovieSearchList>(APICONSTANT.IMDBAPI, { params: this.makeQuery('s', movieName) })
    }

    public getMovieDetailByID(imdbID: string): Observable<MovieDetails> {
        return this.httpClient.get<MovieDetails>(APICONSTANT.IMDBAPI, { params: this.makeQuery('i', imdbID) })
    }

    private makeQuery(queryString: string, queryValue: string): HttpParams {
        let queryParams = new HttpParams();
        queryParams = queryParams.append('apikey', APICONSTANT.IMDBID);
        queryParams = queryParams.append(queryString, queryValue);
        return queryParams;
    }
}