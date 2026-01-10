import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderEntryPage } from './order-entry.page';

describe('OrderEntryPage', () => {
  let component: OrderEntryPage;
  let fixture: ComponentFixture<OrderEntryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
