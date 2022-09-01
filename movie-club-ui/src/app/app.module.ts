import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//External Needed Modules
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/shared/material-module';
import { NgZorroAntdModule } from 'src/shared/ng-zorro-ant-module';
import { SearchComponent } from './feature/movie-detail/search/search.component';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FeatureModule } from './feature/feature.module';
import { ErrorShowingComponent } from './shared/error-showing/error-showing.component';
import { SpinnierComponent } from './shared/spinnier/spinnier.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ErrorShowingComponent,
    SpinnierComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    NgZorroAntdModule,
    FeatureModule,
    AutocompleteLibModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
