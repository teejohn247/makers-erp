import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/utils/notification.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { SettingsService } from 'src/app/shared/services/settings/settings.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  loggedInUser: any;
  systemRoles: any[] = [];
  accordionItems: any[] = [];
  overlayActive: boolean = true;
  companyName: string;
  generalInfoForm: any;
  companyCreated: boolean;

  panelOpenState = false;

  systemRolesForm: FormGroup;

  constructor(
    private notify: NotificationService,
    private hrService: HumanResourcesService,
    private settingsService: SettingsService,
    private authService: AuthenticationService, 
    private fb: FormBuilder
  ) {

    this.loggedInUser = this.authService.loggedInUser;
    console.log(this.loggedInUser);
    this.companyCreated = this.loggedInUser.data.activeStatus;

    this.generalInfoForm = this.fb.group({
      companyName: [this.loggedInUser?.data?.companyName],
      companyAddress: [''],
      superAdminEmail: [this.loggedInUser?.data.email],
      superAdminPassword: [''],
    })
  }

  ngOnInit(): void {
    //this.getDepartments();
    //this.getCompanyRoles();
    this.generalInfoForm.controls['companyName'].disable();
    this.generalInfoForm.controls['superAdminEmail'].disable();

    this.accordionItems = [
      {
        label: "Super Admin",
        key: "superAdmin",
        users: [
          {
            email: "dev@silo-inc.com"
          }
        ]
      },
      {
        label: "HR Module Admin",
        key: "hrAdmin",
        users: [
          {
            email: "matthew@silo-inc.com"
          },
          {
            email: "ray@silo-inc.com"
          }
        ]
      },
      {
        label: "Accounts Module Admin",
        key: "accountsAdmin",
        users: [
          {
            email: "ray@silo-inc.com"
          }
        ]
      },
      {
        label: "Projects Management Module Admin",
        key: "pmAdmin",
        users: [
          {
            email: "matthew@silo-inc.com"
          },
        ]
      },
      {
        label: "CRM Module Admin",
        key: "crmAdmin",
        users: [
          {
            email: "matthew@silo-inc.com"
          },
          {
            email: "ray@silo-inc.com"
          }
        ]
      },
      {
        label: "Supply Chain Module Admin",
        key: "scmAdmin",
        users: [
          {
            email: "ray@silo-inc.com"
          }
        ]
      }
    ]

    //console.log(this.accordionItems);

    this.systemRolesForm = this.fb.group({})
    this.accordionItems.forEach(field => {
      const formControl = this.fb.control('')
      this.systemRolesForm.addControl(field.key, formControl)
    })
  }

  createCompany() {
    let info = {
      companyName: this.companyName
    }
    this.settingsService.createCompany(info).subscribe({
      next: res => {
        console.log(res);
        if(res.status == 200) {
          this.notify.showSuccess('Company name has been created and saved successfully');
          this.generalInfoForm.controls['companyName'].setValue(this.companyName);
          this.companyCreated = res.data.activeStatus;
        }
      },
      error: err => {
        console.log(err)
        this.notify.showError(err.message);
      }          
    })
  }

  


  // getDepartments() {
  //   this.hrService.getDepartments().subscribe(res => {
  //     if(res.status == 200) {
  //       this.departmentList = res.data;
  //     }
  //     console.log(this.departmentList);
  //   })
  // }

  // getCompanyRoles() {
  //   this.hrService.getCompanyRoles().subscribe(res => {
  //     if(res.status == 200) {
  //       this.companyRoles = res.data;
  //     }
  //     //console.log(this.companyRoles);
  //   })
  // }

}
