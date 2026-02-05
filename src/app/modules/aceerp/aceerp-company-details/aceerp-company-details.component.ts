import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { companyModules } from '../../../core/constants/system-modules';
import { AceerpService } from 'src/app/shared/services/aceerp/aceerp.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AceerpSubscriptionActivationComponent } from '../aceerp-subscription-activation/aceerp-subscription-activation.component';
import { AceerpRoleInfoComponent } from '../aceerp-role-info/aceerp-role-info.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-aceerp-company-details',
  templateUrl: './aceerp-company-details.component.html',
  styleUrls: ['./aceerp-company-details.component.scss']
})
export class AceerpCompanyDetailsComponent implements OnInit {

  companyId: string;
  companyList: any[] = [];
  companyInView: any;
  activeTab:string;
  systemModules:any[] = [];
  companyModules = companyModules
  subscriptionPlans: any[] = [];
  subHistory: any;

  currentCompanyModules:any
  formReady:boolean = false;

  companyRoles = [
    {
      roleId: 1,
      roleName: 'Super Admin',
      rolePermissions: [
        {
          moduleId: 1,
          featureId: 1,
          permissionKey: 'canViewEmployees',
          permissionName: 'Can View Employees',
          permissionValue: true
        }
      ]
    },
    {
      roleId: 2,
      roleName: 'HR Admin',
      rolePermissions: [
        {
          moduleId: 1,
          featureId: 1,
          permissionKey: 'canViewEmployees',
          permissionName: 'Can View Employees',
          permissionValue: true
        }
      ]
    }
  ]

  permissionsForm:FormGroup = new FormGroup({});

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private location: Location,
    private activatedRoute:ActivatedRoute, 
    private aceerpService: AceerpService,    
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.companyId = this.activatedRoute.snapshot.params["id"];
    this.getPageData();
  }

  getPageData = async () => {
    this.companyList = await this.aceerpService.getAllUsers().toPromise();
    // console.log(this.companyList);
    this.subscriptionPlans = await this.aceerpService.getAllSubscriptionPlans().toPromise();
    //this.subHistory = await this.aceerpService.getCompanySubscriptionHistory(this.companyId).toPromise();
    // console.log(this.subHistory)
    this.systemModules = await this.aceerpService.getSystemModules().toPromise();

    await this.getCompanyDetails()
    // this.companyInView = this.companyList['data'].find(company => this.companyId == company._id)
    
    this.formReady = true;
    // this.permissionsForm.valueChanges.subscribe(val => {
    //   console.log(val)
    // })

  }

  goBack() {
    this.location.back();
  }

  toggleModuleInfo(moduleName:string) {
    this.activeTab == moduleName ? this.activeTab = '' : this.activeTab = moduleName
  }

  modulePermissions(moduleKey:string) {
    return this.permissionsForm.get(moduleKey) as FormArray;
  }

  generateFormGroup() {
    console.log('Company Details', this.companyInView)
    if(this.companyInView) {
      this.companyInView.companyFeatures.modules.forEach(module => {
        this.addModuleToFormGroup(module);
        this.generateModuleRolesFormGroup(module);
      })
    }
    //console.log(this.permissionsForm.value)
  }

  addModuleToFormGroup(moduleData) {
    const formArr = new FormArray([]);
    this.permissionsForm.addControl(moduleData.key, formArr)
  }

  generateModuleRolesFormGroup(moduleData) {
    this.companyInView.systemRoles.map(role => {
      const features = new FormGroup({});
      moduleData.moduleFeatures.map(feature => {
        feature.featurePermissions.map(p => {
          let reqVal = role.rolePermissions
          .find(x => x.key == moduleData.key).moduleFeatures
          .find(y => y.featureKey == feature.featureKey).featurePermissions
          .find(v => v.key == p.key).value;
          const formControl = new FormControl(reqVal)
          features.addControl(p.key, formControl)
        })
      });

      this.modulePermissions(moduleData.key).push(features)
    })
  }

  getCompanyDetails() {
    this.aceerpService.getCompanyDetails(this.companyId).subscribe({
      next: res => {
        // console.log(res);
        if(res.success) {
          this.companyInView = res.data;
          console.log(this.companyInView);
          this.currentCompanyModules = this.companyInView.companyFeatures.modules;
          this.generateFormGroup();
        }
      },
      error: err => {
        console.log(err)
        this.notifyService.showError(err.error.error);
      } 
    })
  }

  // addRolePermission() {
  //   const permission = new FormGroup({});
  //   this.companyInView.companyFeatures.modules.forEach(module => {
  //     module.moduleFeatures.map(feature => {
  //       feature.featurePermissions.map(p => {
  //         const formControl = new FormControl(p.value)
  //         permission.addControl(p.key, formControl)
  //       })
  //     })
  //   });

  //   this.rolePermissions.push(permission);
  // }

  //Activate Subscription
  activateSubscription() {
    this.dialog.open(AceerpSubscriptionActivationComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        companyId: this.companyInView?._id,
        moduleList: this.systemModules['data'],
        subscriptionPlans: this.subscriptionPlans['data']
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }


  //Create New Role
  createRole() {
    this.dialog.open(AceerpRoleInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        moduleList: this.companyInView?.companyFeatures.modules
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  saveChanges() {
    console.log('BEFORE TRANSFORMATION', this.permissionsForm.value);
    let permissionsVal = this.permissionsForm.value;

    Object.keys(permissionsVal).forEach((moduleKey) => {
      let modulePermissions:any[] = permissionsVal[moduleKey];
      let newModulePermissions:any[] = []

      //Generate an array that combines the features and permissionKeys under each module
      let arrayfeatIdPermKeys:any[] = []
      let moduleFeat:any[] = this.currentCompanyModules.find(module => module.key == moduleKey).moduleFeatures;
      moduleFeat.map(feat => {
        feat.featurePermissions.find(permission => {
          let combineData = {
            featureId: feat.featureId,
            permissionKey: permission.key
          }
          arrayfeatIdPermKeys.push(combineData)
        })
      })

      //Loop through each role in a module and transform the data to have required Ids
      this.companyInView.systemRoles.map((role, roleIndex) => {
        let rolePermissionsArr:any[] = []
        Object.keys(modulePermissions[roleIndex]).map(permissionKey => {
          let newPermissionVal = {
            featureId: arrayfeatIdPermKeys.find(x => x.permissionKey == permissionKey).featureId,
          }
          newPermissionVal[permissionKey] = modulePermissions[roleIndex][permissionKey]
          rolePermissionsArr.push(newPermissionVal)
        })
        
        let reqTransData = {
          roleId: role['_id'],
          rolePermissions: rolePermissionsArr
        }
        newModulePermissions.push(reqTransData)
      })

      //Assign original module key value to new value
      permissionsVal[moduleKey] = newModulePermissions

    })
    console.log('AFTER TRANSFORMATION', permissionsVal)

    let payload = {
      companyId: this.companyId,
      modules: permissionsVal
    }

    this.aceerpService.updatePermissions(payload).subscribe({
      next: res => {
        // console.log(res);
        if(res.success) {
          this.notifyService.showSuccess('Your permissions have been updated successfully')
          this.getCompanyDetails()
        }
      },
      error: err => {
        console.log(err)
        this.notifyService.showError(err.error.error);
      } 
    })

  }

}
