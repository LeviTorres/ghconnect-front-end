import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinaceRequestComponent } from './edit-finace-request.component';

describe('EditFinaceRequestComponent', () => {
  let component: EditFinaceRequestComponent;
  let fixture: ComponentFixture<EditFinaceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFinaceRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFinaceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
