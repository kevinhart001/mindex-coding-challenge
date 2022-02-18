import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-direct-report',
  templateUrl: './direct-report.component.html',
  styleUrls: ['./direct-report.component.css']
})
export class DirectReportComponent implements OnInit {
  @Input() employeeId : number;
  employee$ : Observable<Employee>;
  errorMessage : string;

  @Output() onEdit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  
  constructor(private employeeService : EmployeeService) { }

  ngOnInit(): void {
    this.employee$ = this.employeeService.get(this.employeeId)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employee';
  }
}
