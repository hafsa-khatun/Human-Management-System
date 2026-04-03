import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollProcessing } from './payroll-processing';

describe('PayrollProcessing', () => {
  let component: PayrollProcessing;
  let fixture: ComponentFixture<PayrollProcessing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollProcessing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollProcessing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
