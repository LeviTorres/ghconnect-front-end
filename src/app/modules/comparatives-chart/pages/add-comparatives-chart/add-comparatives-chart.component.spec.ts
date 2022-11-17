import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComparativesChartComponent } from './add-comparatives-chart.component';

describe('AddComparativesChartComponent', () => {
  let component: AddComparativesChartComponent;
  let fixture: ComponentFixture<AddComparativesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComparativesChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddComparativesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
