import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatCardModule
  ]
})
export class MaterialModule {
}
