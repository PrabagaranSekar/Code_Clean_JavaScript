import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/shared/material-module';
import { NgZorroAntdModule } from 'src/shared/ng-zorro-ant-module';

import { ErrorShowingComponent } from './error-showing.component';

xdescribe('ErrorShowingComponent', () => {
  let component: ErrorShowingComponent;
  let fixture: ComponentFixture<ErrorShowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NgZorroAntdModule,
      ],
      declarations: [ErrorShowingComponent]
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
