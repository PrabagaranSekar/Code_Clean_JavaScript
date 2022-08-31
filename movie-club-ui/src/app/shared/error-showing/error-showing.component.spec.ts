import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorShowingComponent } from './error-showing.component';

describe('ErrorShowingComponent', () => {
  let component: ErrorShowingComponent;
  let fixture: ComponentFixture<ErrorShowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorShowingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorShowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
