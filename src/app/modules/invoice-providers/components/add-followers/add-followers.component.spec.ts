import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFollowersComponent } from './add-followers.component';

describe('AddFollowersComponent', () => {
  let component: AddFollowersComponent;
  let fixture: ComponentFixture<AddFollowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFollowersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
