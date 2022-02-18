import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {catchError, map, mergeMap, reduce, tap} from 'rxjs/operators';
import {Employee} from '../employee';
import { EmployeeModificationDialogComponent } from '../employee-modification-dialog/employee-modification-dialog.component';
import { EmployeeModifyAction, EMPLOYEE_ACTION } from '../employee-modify-action';
import {EmployeeService} from '../employee.service';
import { find, propEq, mergeRight, reject, equals } from 'ramda';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(private employeeService: EmployeeService, private dialog : MatDialog) {
  }

  ngOnInit(): void {
    this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => this.employees = emps),
        catchError(this.handleError.bind(this))
      ).subscribe();
  }

  handleEdit(employeeId : number) : void {
    let employee = this.findEmployee(employeeId);

    const dlgRef = this.dialog.open(EmployeeModificationDialogComponent, {
      data: new EmployeeModifyAction(EMPLOYEE_ACTION.EDIT, employee)
    });

    dlgRef.afterClosed().subscribe((result : EmployeeModifyAction) => {
      if (!result) return; // cancelled;

      this.employeeService.save(result.employee)
        .pipe(catchError(this.handleError.bind(this)))
        .subscribe(this.ngOnInit.bind(this));
    });
  }

  handleDelete({employeeId, supervisorEmployeeId}) : void {
    let employee = this.findEmployee(employeeId);

    const dlgRef = this.dialog.open(EmployeeModificationDialogComponent, {
      data: new EmployeeModifyAction(EMPLOYEE_ACTION.DELETE, employee)
    });

    dlgRef.afterClosed().subscribe((result : EmployeeModifyAction) => {
      if (!result) return; // cancelled;

      // remove the direct report from this supervisor
      let supervisor = this.removeDirectReport(this.findEmployee(supervisorEmployeeId), employeeId);

      // do the remove of the employee and remove from supervisor's list, then refresh
      this.employeeService.remove(result.employee)
        .pipe(catchError(this.handleError.bind(this)))
        .subscribe(() => {
          this.employeeService.save(supervisor)
            .pipe(catchError(this.handleError.bind(this)))
            .subscribe(this.ngOnInit.bind(this))
        });
    });
  }

  private findEmployee(employeeId : number) : Employee {
    return find(propEq('id', employeeId))(this.employees);
  }

  private removeDirectReport(supervisor : Employee, directReportEmployeeId : number) : Employee {
    if (!supervisor || !supervisor.directReports) return supervisor;

    return mergeRight(supervisor, {
      directReports : reject(equals(directReportEmployeeId), supervisor.directReports)
    });
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}