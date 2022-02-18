import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeModifyAction, EMPLOYEE_ACTION } from '../employee-modify-action';

@Component({
  selector: 'app-employee-modification-dialog',
  templateUrl: './employee-modification-dialog.component.html',
  styleUrls: ['./employee-modification-dialog.component.css']
})
export class EmployeeModificationDialogComponent implements OnInit {
  ACTIONS = EMPLOYEE_ACTION;
  compensationFormControl = new FormControl('', [Validators.required]);

  constructor(
    private dialogRef : MatDialogRef<EmployeeModificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public modifyActionData : EmployeeModifyAction
  ) {}

  ngOnInit(): void {
  }

  handleCancel() : void {
    this.dialogRef.close();
  }

  handleSave() : void {
    if (!this.compensationFormControl.valid) return;

    this.dialogRef.close(this.modifyActionData);
  }
}
