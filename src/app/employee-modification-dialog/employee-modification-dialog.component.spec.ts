import { compileComponentFromRender2 } from '@angular/compiler/src/render3/view/compiler';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../employee';
import { EMPLOYEE_ACTION } from '../employee-modify-action';

import { EmployeeModificationDialogComponent } from './employee-modification-dialog.component';

describe('EmployeeModificationDialogComponent', () => {
  let component: EmployeeModificationDialogComponent;
  let fixture: ComponentFixture<EmployeeModificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ EmployeeModificationDialogComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: (result : any) => {} }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeModificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show edit compensation form for edit', () => {
    component.modifyActionData.actionType = EMPLOYEE_ACTION.EDIT;
    component.modifyActionData.employee = new Employee();

    fixture.detectChanges();

    let h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Update Compensation');
  });

  it('should show delete warning for delete', () => {
    component.modifyActionData.actionType = EMPLOYEE_ACTION.DELETE;
    component.modifyActionData.employee = new Employee();

    fixture.detectChanges();

    let h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Delete Direct Report');
  });
});
