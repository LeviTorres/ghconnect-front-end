import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceProviderComponent } from './edit-invoice-provider.component';

describe('EditInvoiceProviderComponent', () => {
  let component: EditInvoiceProviderComponent;
  let fixture: ComponentFixture<EditInvoiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInvoiceProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvoiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
