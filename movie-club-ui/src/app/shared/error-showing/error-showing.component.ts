import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-showing',
  templateUrl: './error-showing.component.html',
  styleUrls: ['./error-showing.component.css']
})
export class ErrorShowingComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
