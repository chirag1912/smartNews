import { NavbarComponent } from './../navbar/navbar.component';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import awsExports from '../../../aws-exports';
import { Auth, Hub } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import { User} from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  that : any;
  // constructor() { }

  // ngOnInit(): void {
  // }

  constructor( private userservice: UserService, private router: Router, private _authService : AuthService, private _router : Router, private _navbar: NavbarComponent) {
    Amplify.configure(awsExports);
    this.that = this;
    const listener = (data : any) => {
      switch (data.payload.event) {
          case 'signIn':
              // logger.info('user signed in');
              console.log("succesfful signin...")
              this.router.navigate(['/']);
              break;
          case 'signUp':
                console.log('user signed up');
                console.log(data);
                let user : User = {
                  userEmail:  data.payload.data.user.username,
                  username: '',
                  useraddress: '',
                  rewards: 0,
                  bookings: []
                }
                this.createuser(user);
              
                break;
            
       
      }
  }
    Hub.listen('auth', listener);
   }

async createuser(user:User)
{
  await this.userservice.createuser(user);
}
   
  ngOnInit(): void {
    window.location.href = 'https://roommatefinder.auth.us-west-2.amazoncognito.com/login?client_id=4msq0q4v0p8sg1bfieu1abn83h&response_type=token&scope=openid+email&redirect_uri=http://localhost:4200';
 
    console.log("------on init------");
 }
  
  ngOnDestroy(): void {
    console.log('ngOnDestroy-login component');
    if(localStorage.length > 0)
    {
      this._navbar.user = true;
      this._navbar.checkAdmin();
    }
  }
  
  services = {
    async handleSignUp(formData: Record<string, any>) {
      let { username, password, attributes } = formData;
      // custom username
      username = username.toLowerCase();
      attributes.email = attributes.email.toLowerCase();
      // console.log(attributes); 
     
      return Auth.signUp({
        username,
        password,
        attributes,
      });
    }
    
  };
}
