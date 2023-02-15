import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivitiesComponent } from './edit-activities.component';

describe('EditActivitiesComponent', () => {
  let component: EditActivitiesComponent;
  let fixture: ComponentFixture<EditActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
