import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MovieHttpInteceptor } from '../shared/HttpInterceptor';
import { FeatureRoutingModule } from './feature-routing.module';
import { MovieSearchService } from './services/movie-services';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ],
  providers: [
    MovieSearchService,
    { provide: HTTP_INTERCEPTORS, useClass: MovieHttpInteceptor, multi: true }]
})
export class FeatureModule { }
