import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-salary-scale-info',
  templateUrl: './salary-scale-info.component.html',
  styleUrls: ['./salary-scale-info.component.scss']
})
export class SalaryScaleInfoComponent implements OnInit {

  salaryScaleForm!: FormGroup;
  salaryScaleFieldData: FormFields[];
  apiLoading:boolean = false;

  salaryScaleLevelDetails:FormArray;
  activeTab:number = 0;
  salaryScaleId:string;

  @Input() payrollCredits:any[];
  @Input() payrollDebits:any[];
  @Input() editMode:boolean;
  @Input() salaryScaleInfo$ = new BehaviorSubject<any>(null);

  @Output() triggerModalClosure:EventEmitter<any> = new EventEmitter();

  payrollCreditOptions:any;
  payrollDebitOptions:any;

  payTypeOptions = {
    exact: 'Exact',
    percentage: 'Percentage'
  }

  constructor(
    private datePipe: DatePipe,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.salaryScaleForm = this.fb.group({});

    console.log(this.payrollCredits);
    console.log(this.payrollDebits);

    this.payrollCreditOptions = this.arrayToObject(this.payrollCredits, 'name');
    this.payrollDebitOptions = this.arrayToObject(this.payrollDebits, 'name');

    this.salaryScaleFieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'minAmount',
        controlType: 'number',
        controlLabel: 'Min Amount',
        controlWidth: '48%',
        initialValue: 0,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'maxAmount',
        controlType: 'number',
        controlLabel: 'Max Amount',
        controlWidth: '48%',
        initialValue: 0,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: null,
        validators: null,
        order: 4
      },
    ]

    this.salaryScaleFieldData.sort((a,b) => (a.order - b.order));
    this.salaryScaleForm = this.fb.group({
      salaryScaleLevels: new FormArray([]),
    });

    this.salaryScaleFieldData.forEach(field => {
      const formControl = new FormControl(field.initialValue, field.validators)
      this.salaryScaleForm.addControl(field.controlName, formControl)
    });

    this.salaryScaleLevelDetails = this.salaryScaleForm.get("salaryScaleLevels") as FormArray;

    this.salaryScaleInfo$.subscribe(info => {
      if(info) {
        console.log('Salary Scale Info', info)
        this.salaryScaleId = info._id;
        this.salaryScaleForm.patchValue({
          name: info.name,
          minAmount: info.minAmount,
          maxAmount: info.maxAmount,
          description: info.description
        })

        info.salaryScaleLevels.map((level:any, levelIndex:number) => {
          this.addLevel(level);
          level.payrollCredits.map(info => this.addLevelCredit(levelIndex, info));
          level.payrollDebits.map(info => this.addLevelDebit(levelIndex, info))
        })
      }
      else {
        this.salaryScaleForm.reset();
        if(this.salaryScaleLevelDetails.controls.length > 0) {
          this.salaryScaleLevelDetails.controls.forEach((ctrl, levelIndex) => {
            if(levelIndex != 0) this.removeLevel(levelIndex);
          });
        }
        else {
          this.addLevel();
        }
      }
      
    })

    this.salaryScaleForm.valueChanges.subscribe(val => {
      console.log(val)
    })

  }

  closeModal() {
    this.triggerModalClosure.emit('close')
  }

  addLevel(levelInfo?:any) {
    console.log('I have info', levelInfo)
    const level = new FormGroup({
      levelName: new FormControl(levelInfo ? levelInfo.levelName : 'Level ' + Number(this.salaryScaleLevelDetails.controls.length + 1), Validators.required),
      payrollCredits: new FormArray([]),
      payrollDebits: new FormArray([]),
    });
    this.salaryScaleLevelDetails.push(level);
  }
  removeLevel(index: number) {
    this.salaryScaleLevelDetails.removeAt(index);
  }
  toggleLevelInfo(index:number) {
    this.activeTab == index ? this.activeTab = -1 : this.activeTab = index;
  }

  levelCredits(levelIndex:number) : FormArray {
    return this.salaryScaleLevelDetails.at(levelIndex).get("payrollCredits") as FormArray
  }

  addLevelCredit(levelIndex:number, creditInfo?:any) {
    const credit = new FormGroup({
      name: new FormControl(creditInfo ? creditInfo.creditId : '', Validators.required),
      type: new FormControl(creditInfo ? creditInfo.type : '', Validators.required),
      value: new FormControl(creditInfo ? creditInfo.value : 0),
      ref: new FormControl(creditInfo ? creditInfo.ref : ''),
    });

    this.levelCredits(levelIndex).push(credit);
  }

  removeLevelCredit(levelIndex:number, creditIndex:number) {
    this.levelCredits(levelIndex).removeAt(creditIndex);
  }

  levelDebits(levelIndex:number) : FormArray {
    return this.salaryScaleLevelDetails.at(levelIndex).get("payrollDebits") as FormArray
  }

  addLevelDebit(levelIndex:number, debitInfo?:any) {
    const credit = new FormGroup({
      name: new FormControl(debitInfo ? debitInfo.debitId : '', Validators.required),
      type: new FormControl(debitInfo ? debitInfo.type : '', Validators.required),
      value: new FormControl(debitInfo ? debitInfo.value : 0),
      ref: new FormControl(debitInfo ? debitInfo.ref : ''),
    });

    this.levelDebits(levelIndex).push(credit);
  }

  removeLevelDebit(levelIndex:number, debitIndex:number) {
    this.levelDebits(levelIndex).removeAt(debitIndex);
  }

  payValueLimit(levelIndex, itemIndex, payrollType:string) {
    let payType
    if(payrollType == 'credit') {
      payType = this.levelCredits(levelIndex).controls[itemIndex].get('type').value
    }
    else {
      payType = this.levelDebits(levelIndex).controls[itemIndex].get('type').value
    } 
    return payType == 'percentage' ? 100 : 1000000000
  }

  payValueRef(levelIndex, itemIndex, payrollType:string) {
    let payType
    if(payrollType == 'credit') {
      payType = this.levelCredits(levelIndex).controls[itemIndex].get('type').value
    }
    else {
      payType = this.levelDebits(levelIndex).controls[itemIndex].get('type').value
    } 
    return payType == 'percentage' ? true : false
  }



  onSubmit() {
    if(this.salaryScaleForm.valid) {
      this.apiLoading = true
      // let payload = 
      // console.log(payload);
      if(this.editMode) {
        this.hrService.updateSalaryScale(this.salaryScaleId, this.salaryScaleForm.value).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This salary scale has been updated successfully');
              this.apiLoading = false;
            }
            //this.getPageData();
          },
          error: err => {
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createSalaryScale(this.salaryScaleForm.value).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This salary scale has been created successfully');
              this.apiLoading = false;
            }
            //this.getPageData();
          },
          error: err => {
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    }
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    //console.log(reqObj);
    return reqObj;
  }

}
