import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageShipperComponent } from './page-shipper.component';

describe('PageShipperComponent', () => {
  let component: PageShipperComponent;
  let fixture: ComponentFixture<PageShipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageShipperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
