import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { MovieSearchService } from '../../services/movie-services'
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MaterialModule } from 'src/shared/material-module';
import { NgZorroAntdModule } from 'src/shared/ng-zorro-ant-module';
import { MOVIEINPUT, SCORECODE } from '../../const/common-const';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const spyMovieSearchService: jasmine.SpyObj<MovieSearchService> = jasmine.createSpyObj('MovieSearchService', ['getMovieByName', 'getMovieDetailByID'])

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        NgZorroAntdModule,
        AutocompleteLibModule,
        BrowserModule],
      declarations: [SearchComponent],
      providers: [
        { provide: MovieSearchService, useValue: spyMovieSearchService }
      ]
    })
      .compileComponents();

    spyMovieSearchService.getMovieByName.and.returnValue(of());
    spyMovieSearchService.getMovieDetailByID.and.returnValue(of())
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should get First movie suggestion list', () => {
    spyMovieSearchService.getMovieByName.and.returnValue(of(mockMovie))
    component.ngOnInit();
    component.getMovieSuggestionList('singam', MOVIEINPUT.FIRST);
    expect(component.firstMovieSuggestionList.length).toBeGreaterThan(0);
  })

  it('it should get Second movie suggestion list', () => {
    spyMovieSearchService.getMovieByName.and.returnValue(of(mockMovie))
    component.ngOnInit();
    component.getMovieSuggestionList('singam', MOVIEINPUT.SECOND);
    expect(component.secondMovieSuggestionList.length).toBeGreaterThan(0);
  })

  it('it should get No suggestion list', () => {
    spyMovieSearchService.getMovieByName.and.returnValue(of(mockNoFoundMovie))
    component.ngOnInit();
    component.getMovieSuggestionList('singam', MOVIEINPUT.FIRST);
    component.getMovieSuggestionList('singam', MOVIEINPUT.SECOND);
    expect(component.firstMovieSuggestionList.length).toEqual(0);
    expect(component.secondMovieSuggestionList.length).toEqual(0);
  })

  it('it should return movie data based on key', () => {
    component.ngOnInit();
    component.firstMovieDetails = mockMovieDetail;
    component.secondMovieDetails = mockMovieDetail;
    const firstMovieRes = component.getMovieDetailValues('Metascore', MOVIEINPUT.FIRST);
    const secondMovieRes = component.getMovieDetailValues('Metascore', MOVIEINPUT.FIRST);
    expect(firstMovieRes).toEqual('46');
    expect(secondMovieRes).toEqual('46');
  })

  it('it should get First movie detail based on user select', () => {
    spyMovieSearchService.getMovieDetailByID.and.returnValue(of(mockMovieDetail));
    component.ngOnInit();
    component.selectedMovie('tt1655607', MOVIEINPUT.FIRST);
    expect(component.isFirstMovieResponse).toBeTrue();
  })

  it('it should get Second movie detail based on user select', () => {
    spyMovieSearchService.getMovieDetailByID.and.returnValue(of(mockMovieDetail));
    component.ngOnInit();
    component.selectedMovie('tt1655607', MOVIEINPUT.SECOND);
    expect(component.isSecondMovieResponse).toBeTrue();
  })

  it('it should clear all movie detail when user clear search', () => {
    component.searchCleared(MOVIEINPUT.FIRST);
    component.searchCleared(MOVIEINPUT.SECOND);
    expect(component.isFirstMovieResponse).toBeFalse();
    expect(component.firstMovieDetails).toBeNull()
    expect(component.isSecondMovieResponse).toBeFalse();
    expect(component.secondMovieDetails).toBeNull()
  })

  it('it should return recent search movie Details', () => {
    spyMovieSearchService.getMovieDetailByID.and.returnValue(of(mockMovieDetail));
    component.researchRecentMovieData(mockRecentMovieDetail);
    expect(component.isFirstMovieResponse).toBeTrue();
    expect(component.isSecondMovieResponse).toBeTrue();
  })

  it('it should return metascore color', () => {
    expect(component.calculateMetaScore('80')).toEqual(SCORECODE.HIGH);
    expect(component.calculateMetaScore('60')).toEqual(SCORECODE.AVERAGE);
    expect(component.calculateMetaScore('40')).toEqual(SCORECODE.BELOW_AVERAGE);
    expect(component.calculateMetaScore('20')).toEqual(SCORECODE.LOW);
  })

  it('it should return IMDB Rating color', () => {
    expect(component.getImdbRatingColor('8')).toEqual(SCORECODE.HIGH);
    expect(component.getImdbRatingColor('6')).toEqual(SCORECODE.AVERAGE);
    expect(component.getImdbRatingColor('4')).toEqual(SCORECODE.BELOW_AVERAGE);
    expect(component.getImdbRatingColor('2')).toEqual(SCORECODE.LOW);
  })

  it('it should return BoxOffice collection color', () => {
    expect(component.getBoxOfficeColor('$80000000')).toEqual(SCORECODE.HIGH);
    expect(component.getBoxOfficeColor('$60000000')).toEqual(SCORECODE.AVERAGE);
    expect(component.getBoxOfficeColor('$40000000')).toEqual(SCORECODE.BELOW_AVERAGE);
    expect(component.getBoxOfficeColor('$20000000')).toEqual(SCORECODE.LOW);
  })

  it('it should return IMDB Vote color', () => {
    expect(component.getIMDBVotesColor('10000')).toEqual(SCORECODE.HIGH);
    expect(component.getIMDBVotesColor('8000')).toEqual(SCORECODE.AVERAGE);
    expect(component.getIMDBVotesColor('2000')).toEqual(SCORECODE.LOW);
  })

  it('it should return Winning Percentage color', () => {
    expect(component.getWinningPercentageColour(mockMovieDetail)).toEqual(SCORECODE.AVERAGE);
  })
});

const mockRecentMovieDetail = {
  firstMovie: {
    Title: 'Singam',
    imdbID: 'tt1655607'
  },
  secondMovie: {
    Title: 'Singam 2',
    imdbID: 'tt2309600'
  }
}

const mockNoFoundMovie = {
  "Search": [
    {
      "Title": "Singam",
      "Year": "2010",
      "imdbID": "tt1655607",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYTYxMzg2ZGUtY2VhMS00YWFmLWE3MjItOTZhYTQ1MGU3YjEyXkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_SX300.jpg"
    }
  ],
  "Error": "",
  "Response": "True"
}

const mockMovie = {
  "Search": [
    {
      "Title": "Singam",
      "Year": "2010",
      "imdbID": "tt1655607",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYTYxMzg2ZGUtY2VhMS00YWFmLWE3MjItOTZhYTQ1MGU3YjEyXkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_SX300.jpg"
    },
    {
      "Title": "Singam 2",
      "Year": "2013",
      "imdbID": "tt2309600",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BODQ4YTNiZDgtYTI0NS00NzJkLWI5MTgtNTFkNWU2ZTRmNDMzXkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_SX300.jpg"
    },
    {
      "Title": "Singam 3",
      "Year": "2017",
      "imdbID": "tt5323640",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMDZmNmVkYTgtYjFhZC00ZWRiLWJjOTItMzgwYzk3MDAzZDQzXkEyXkFqcGdeQXVyOTA0NTIzNzU@._V1_SX300.jpg"
    },
    {
      "Title": "Kadaikutty Singam",
      "Year": "2018",
      "imdbID": "tt8023734",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNWVhYjc1MmItY2NlZi00ZjZmLWJkZjEtZDg3NzMzYTc5OGM1XkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_SX300.jpg"
    },
    {
      "Title": "Silukkuvarupatti Singam",
      "Year": "2018",
      "imdbID": "tt7853260",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNzNhY2Y3ODktZWRmZC00NmYxLWI2NGItNmMzOWJmODRmZDQ0XkEyXkFqcGdeQXVyOTk3NTc2MzE@._V1_SX300.jpg"
    }
  ],
  "Error": "",
  "Response": "True"
}

const mockMovieDetail =
{
  "Title": "Sin City: A Dame to Kill For",
  "Year": "2014",
  "Rated": "R",
  "Released": "22 Aug 2014",
  "Runtime": "102 min",
  "Genre": "Action, Crime, Thriller",
  "Director": "Frank Miller, Robert Rodriguez",
  "Writer": "Frank Miller",
  "Actors": "Mickey Rourke, Jessica Alba, Josh Brolin",
  "Plot": "Some of Sin City's most hard-boiled citizens cross paths with a few of its more reviled inhabitants.",
  "Language": "English",
  "Country": "United States",
  "Awards": "4 wins & 6 nominations",
  "Poster": "https://m.media-amazon.com/images/M/MV5BMjA5ODYwNjgxMF5BMl5BanBnXkFtZTgwMTcwNzAyMjE@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "6.5/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "43%"
    },
    {
      "Source": "Metacritic",
      "Value": "46/100"
    }
  ],
  "Metascore": "46",
  "imdbRating": "6.5",
  "imdbVotes": "161,609",
  "imdbID": "tt0458481",
  "Type": "movie",
  "DVD": "18 Nov 2014",
  "BoxOffice": "$13,757,804",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
}
