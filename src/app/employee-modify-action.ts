import { Employee } from "./employee";

export class EmployeeModifyAction {
    actionType: string;
    employee: Employee;

    constructor(actionType : string, employee : Employee) {
        this.actionType = actionType;
        this.employee = employee;
    }
}

export const EMPLOYEE_ACTION = {
    EDIT: 'EDIT_EMPLOYEE',
    DELETE: 'DELETE_EMPLOYEE'
}