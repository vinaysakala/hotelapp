import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KdsPage } from './kds.page';

describe('KdsPage', () => {
  let component: KdsPage;
  let fixture: ComponentFixture<KdsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
