export interface MovieSearchList {
    Response: string;
    Search: Array<MovieData>;
    Error: string
}

export interface MovieData {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}