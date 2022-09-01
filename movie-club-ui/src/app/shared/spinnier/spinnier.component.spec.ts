import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnierComponent } from './spinnier.component';

describe('SpinnierComponent', () => {
  let component: SpinnierComponent;
  let fixture: ComponentFixture<SpinnierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinnierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
