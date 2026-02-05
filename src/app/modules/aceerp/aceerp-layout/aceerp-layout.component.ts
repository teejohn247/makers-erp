import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../shared/services/utils/authentication.service';

@Component({
  selector: 'app-aceerp-layout',
  templateUrl: './aceerp-layout.component.html',
  styleUrls: ['./aceerp-layout.component.scss']
})
export class AceerpLayoutComponent implements OnInit {

  userDetails: any;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.userDetails = this.auth.loggedInUser;
    console.log(this.userDetails)
  }

}
