import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearDialogComponent } from './clear-dialog.component';

describe('ClearDialogComponent', () => {
  let component: ClearDialogComponent;
  let fixture: ComponentFixture<ClearDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
