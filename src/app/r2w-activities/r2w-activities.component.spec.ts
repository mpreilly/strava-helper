import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { R2wActivitiesComponent } from './r2w-activities.component';

describe('R2wActivitiesComponent', () => {
  let component: R2wActivitiesComponent;
  let fixture: ComponentFixture<R2wActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ R2wActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(R2wActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
