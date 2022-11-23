import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceClientComponent } from './edit-invoice-client.component';

describe('EditInvoiceClientComponent', () => {
  let component: EditInvoiceClientComponent;
  let fixture: ComponentFixture<EditInvoiceClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInvoiceClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvoiceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
