import {async, TestBed} from '@angular/core/testing';
import {Component, Input} from '@angular/core';

import {EmployeeListComponent} from './employee-list.component';
import {EmployeeService} from '../employee.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeModifyAction, EMPLOYEE_ACTION } from '../employee-modify-action';
import { Employee } from '../employee';

@Component({selector: 'app-employee', template: ''})
class EmployeeComponent {
  @Input('employee') employee: any;
}

@Component({selector: 'app-mat-grid-list', template: ''})
class GridListComponent {
}

@Component({selector: 'app-mat-grid-tile', template: ''})
class GridTileComponent {
}

const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAll', 'get', 'save', 'remove']);
const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

describe('EmployeeListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeListComponent,
        EmployeeComponent,
        GridListComponent,
        GridTileComponent
      ],
      providers: [
        {provide: EmployeeService, useValue: employeeServiceSpy},
        {provide: MatDialog, useValue: dialogSpy}
      ],
    }).compileComponents();

    employeeServiceSpy.save.calls.reset();
    employeeServiceSpy.remove.calls.reset();
    dialogSpy.open.calls.reset();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));

  describe('handle edit', () => {
    it('saves employee on confirm', async(() => {
      const fixture = TestBed.createComponent(EmployeeListComponent);
      const comp = fixture.debugElement.componentInstance as EmployeeListComponent;
      expect(comp).toBeTruthy();

      let componentSubscriber : ((result: EmployeeModifyAction) => void) = null;
      
      dialogSpy.open.and.returnValue({
        afterClosed: () => ({
          subscribe: (sub: () => void) => componentSubscriber = sub
        })
      });

      employeeServiceSpy.save.and.returnValue({ pipe: () => ({ subscribe: () => {} }) });

      comp.handleEdit(9);
      expect(componentSubscriber).toBeTruthy();

      let emp : Employee = { id: 9, firstName: 'fn', lastName: 'ln', position: 'pos' };

      componentSubscriber(new EmployeeModifyAction(EMPLOYEE_ACTION.EDIT, emp));
      expect(employeeServiceSpy.save).toHaveBeenCalledTimes(1);
      expect(employeeServiceSpy.save).toHaveBeenCalledWith(emp);
    }));

    it('does not save employee on cancel', async(() => {
      const fixture = TestBed.createComponent(EmployeeListComponent);
      const comp = fixture.debugElement.componentInstance as EmployeeListComponent;
      expect(comp).toBeTruthy();

      let componentSubscriber : ((result: EmployeeModifyAction) => void) = null;
      
      dialogSpy.open.and.returnValue({
        afterClosed: () => ({
          subscribe: (sub: () => void) => componentSubscriber = sub
        })
      });

      employeeServiceSpy.save.and.returnValue({ pipe: () => ({ subscribe: () => {} }) });

      comp.handleEdit(9);
      expect(componentSubscriber).toBeTruthy();

      componentSubscriber(null); // cancel
      expect(employeeServiceSpy.save).toHaveBeenCalledTimes(0);
    }));
  });

  describe('handle delete', () => {
    it('deletes employee on confirm', async(() => {
      const fixture = TestBed.createComponent(EmployeeListComponent);
      const comp = fixture.debugElement.componentInstance as EmployeeListComponent;
      expect(comp).toBeTruthy();

      let componentSubscriber : ((result: EmployeeModifyAction) => void) = null;
      
      dialogSpy.open.and.returnValue({
        afterClosed: () => ({
          subscribe: (sub: () => void) => componentSubscriber = sub
        })
      });

      employeeServiceSpy.remove.and.returnValue({ pipe: () => ({ subscribe: () => {} }) });

      comp.handleDelete({ employeeId: 9, supervisorEmployeeId: 19 });
      expect(componentSubscriber).toBeTruthy();

      let emp : Employee = { id: 9, firstName: 'fn', lastName: 'ln', position: 'pos' };

      componentSubscriber(new EmployeeModifyAction(EMPLOYEE_ACTION.DELETE, emp));
      expect(employeeServiceSpy.remove).toHaveBeenCalledTimes(1);
      expect(employeeServiceSpy.remove).toHaveBeenCalledWith(emp);
    }));

    it('removes from supervisor direct report list on confirm', async(() => {
      const fixture = TestBed.createComponent(EmployeeListComponent);
      const comp = fixture.debugElement.componentInstance as EmployeeListComponent;
      expect(comp).toBeTruthy();

      let componentSubscriber : ((result: EmployeeModifyAction) => void) = null;
      
      dialogSpy.open.and.returnValue({
        afterClosed: () => ({
          subscribe: (sub: () => void) => componentSubscriber = sub
        })
      });

      let removeEmployeeSubscriber = null;
      employeeServiceSpy.remove.and.returnValue({ pipe: () => ({ subscribe: (fn : any) => removeEmployeeSubscriber = fn }) });
      employeeServiceSpy.save.and.returnValue({ pipe: () => ({ subscribe: () => {} }) });

      comp.handleDelete({ employeeId: 9, supervisorEmployeeId: 19 });
      expect(componentSubscriber).toBeTruthy();

      let emp : Employee = { id: 9, firstName: 'fn', lastName: 'ln', position: 'pos' };
      
      // put supervisor in the list
      comp.employees = [ { id: 19, firstName: 'sfn', lastName: 'sln', position: 'spos', directReports: [9] } ];

      componentSubscriber(new EmployeeModifyAction(EMPLOYEE_ACTION.DELETE, emp));
      removeEmployeeSubscriber();

      expect(employeeServiceSpy.save).toHaveBeenCalledTimes(1);

      // expect saved without the direct report
      expect(employeeServiceSpy.save).toHaveBeenCalledWith({ id: 19, firstName: 'sfn', lastName: 'sln', position: 'spos', directReports: [] });
    }));

    it('does not remove employee on cancel', async(() => {
      const fixture = TestBed.createComponent(EmployeeListComponent);
      const comp = fixture.debugElement.componentInstance as EmployeeListComponent;
      expect(comp).toBeTruthy();

      let componentSubscriber : ((result: EmployeeModifyAction) => void) = null;
      
      dialogSpy.open.and.returnValue({
        afterClosed: () => ({
          subscribe: (sub: () => void) => componentSubscriber = sub
        })
      });

      employeeServiceSpy.remove.and.returnValue({ pipe: () => ({ subscribe: () => {} }) });

      comp.handleDelete({ employeeId: 9, supervisorEmployeeId: 19 });
      expect(componentSubscriber).toBeTruthy();

      componentSubscriber(null); // cancel
      expect(employeeServiceSpy.remove).toHaveBeenCalledTimes(0);
    }));
  });
});
