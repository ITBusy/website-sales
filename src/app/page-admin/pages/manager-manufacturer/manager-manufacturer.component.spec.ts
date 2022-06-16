import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerManufacturerComponent } from './manager-manufacturer.component';

describe('ManagerManufacturerComponent', () => {
  let component: ManagerManufacturerComponent;
  let fixture: ComponentFixture<ManagerManufacturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerManufacturerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
