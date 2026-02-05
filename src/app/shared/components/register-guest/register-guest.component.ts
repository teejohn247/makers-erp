import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register-guest',
  templateUrl: './register-guest.component.html',
  styleUrls: ['./register-guest.component.scss']
})
export class RegisterGuestComponent implements OnInit {

  visitorFieldData: any[];
  visitorForm!: FormGroup
  type: 'text' | 'select';
  @Input() control:string;

  constructor(
    public dialogRef: MatDialogRef<RegisterGuestComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.visitorFieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'email',
        controlType: 'text',
        controlLabel: 'Email Address',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required, Validators.email],
        order: 3
      },
      {
        controlName: 'phoneNo',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'timeIn',
        controlType: 'text',
        controlLabel: 'Time In',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'timeOut',
        controlType: 'text',
        controlLabel: 'Time Out',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'host',
        controlType: 'select',
        controlLabel: 'Employee',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          Emeka: 'Emeka Nwafor',
          Tunde: 'Tunde Remi'
        },
        validators: [Validators.required],
        order: 4
      },
    ]

    this.visitorFieldData.sort((a,b) => (a.order - b.order));
    this.visitorForm = this.fb.group({})

    this.visitorFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.visitorForm.addControl(field.controlName, formControl)
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
