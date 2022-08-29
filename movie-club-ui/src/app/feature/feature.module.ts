import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { MovieSearchService } from './services/movie-services';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ],
  providers: [MovieSearchService]
})
export class FeatureModule { }
