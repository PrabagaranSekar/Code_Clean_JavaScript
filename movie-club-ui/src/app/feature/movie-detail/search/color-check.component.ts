import { SCORECODE } from "../../const/common-const";
import { MovieDetails } from "../../model/movie-rating-detail";

export class ColourCodeCheck {


    //Method To Display Card Colour Based on MetaScore
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

    //Method To Display Card Colour Based on IMDBRating
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

    //Method To Display Card Colour Based on BoxOfficeCollection
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

    //Method To Display Card Colour Based on Votes
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

    //Method To Display Card Colour Based on Winning Percentage
    public getWinningPercentageColour(movieDetail: MovieDetails): string {
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

    public calculateWiningPercentage(movie: MovieDetails): number {
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