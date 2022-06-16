import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignWithComponent } from './sign-with.component';

describe('SignWithComponent', () => {
  let component: SignWithComponent;
  let fixture: ComponentFixture<SignWithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignWithComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
