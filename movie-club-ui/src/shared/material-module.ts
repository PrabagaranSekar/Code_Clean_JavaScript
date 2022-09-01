import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class MaterialModule {
}
