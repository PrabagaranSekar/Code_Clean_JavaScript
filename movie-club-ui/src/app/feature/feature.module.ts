import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { MovieSearchService } from './services/movie-services';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MovieHttpInteceptor } from '../shared/HttpInterceptor';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ],
  providers: [MovieSearchService,
    { provide: HTTP_INTERCEPTORS, useClass: MovieHttpInteceptor, multi: true }]
})
export class FeatureModule { }
