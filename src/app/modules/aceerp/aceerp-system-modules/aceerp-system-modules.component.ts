import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { companyModules } from '../../../core/constants/system-modules';
import { AceerpPermissionInfoComponent } from '../aceerp-permission-info/aceerp-permission-info.component';
import { AceerpService } from 'src/app/shared/services/aceerp/aceerp.service';

@Component({
  selector: 'app-aceerp-system-modules',
  templateUrl: './aceerp-system-modules.component.html',
  styleUrls: ['./aceerp-system-modules.component.scss']
})
export class AceerpSystemModulesComponent implements OnInit {

  activeTab:string;
  systemModules:any[];

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

  constructor(
    public dialog: MatDialog,
    private aceerpService: AceerpService,
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  toggleModuleInfo(moduleName:string) {
    this.activeTab == moduleName ? this.activeTab = '' : this.activeTab = moduleName
  }

  //Create New Permission
  createPermission() {
    this.dialog.open(AceerpPermissionInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        moduleList: this.systemModules,
        featureList: this.systemModules[0].moduleFeatures
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  getPageData = async () => {
    this.systemModules = await this.aceerpService.getSystemModules().toPromise();
    console.log(this.systemModules);
    this.systemModules = this.systemModules['data']
  }

}
