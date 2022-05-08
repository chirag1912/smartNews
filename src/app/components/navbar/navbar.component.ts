import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  isLoggedIn: boolean = false;
  constructor(public authService: AuthService, private _Activatedroute: ActivatedRoute) { }
  showFiller = false;
  userLoggedIn?: Promise<boolean>;
  user: boolean = false;
  role: any;
  isAdmin: boolean = false;
  // userDetails = Auth.currentUserInfo();

  async ngOnInit(): Promise<void> {
    console.log("ngOnInit-navbar");
    this.userLoggedIn = this.authService.isLoggedIn();

    this.user = await this.userLoggedIn;
    this.checkAdmin();
    // this.getGroup();

  }
  async signOut()
  {
   let user = await Auth.currentAuthenticatedUser();
   let signout = await user.signOut();
   console.log(signout);
   this.userLoggedIn = this.authService.isLoggedIn();
   
   this.user = await this.userLoggedIn;
  }

  async getGroup() {
    let group = await this.authService.getUserGroup();
    console.log('user group');
    console.log(group);

  }
  async checkAdmin() {

    let role = this.authService.getUserGroup();
    this.role = await role;
console.log("checkadmin");
console.log(this.role);
    if (this.role.indexOf("admins") !== -1) {
      this.isAdmin = true;
      
    }
    else {
      this.isAdmin = false;
      
    }
  }
}
