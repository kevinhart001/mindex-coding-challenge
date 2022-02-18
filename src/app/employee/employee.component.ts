import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Employee} from '../employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  @Input() employee: Employee;
  
  @Output() onEdit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<{ employeeId : number, supervisorEmployeeId: number }>();

  constructor() {
  }

  handleDelete(employeeId: number) {
    this.onDelete.emit({ employeeId, supervisorEmployeeId: this.employee.id });
  }
}
