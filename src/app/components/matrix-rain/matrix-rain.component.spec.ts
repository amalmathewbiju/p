import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixRainComponent } from './matrix-rain.component';

describe('MatrixRainComponent', () => {
  let component: MatrixRainComponent;
  let fixture: ComponentFixture<MatrixRainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatrixRainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixRainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
