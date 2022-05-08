import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = false;

  roleAs: any;
  constructor() { }
  login(value: string) {
    this.isLogin = true;
    this.roleAs = value;
    localStorage.setItem('STATE', 'true');
    localStorage.setItem('ROLE', this.roleAs);
    return of({ success: this.isLogin, role: this.roleAs });
  }

  logout() {
    this.isLogin = false;
    this.roleAs = '';
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    return of({ success: this.isLogin, role: '' });
  }

  async isLoggedIn() : Promise<boolean>
{

  const user = await Auth.currentUserInfo(); 
  console.log('userInFo');
  console.log(user);
  if (user)
  {
    return true;
  }
  else{
    return false;
  }
  
}

async getUserDetails() 
{
  const user = await Auth.currentUserInfo(); 
  console.log('userInFo');
  console.log(user);
  return user;
}

async getUserGroup() : Promise<Promise<any>[]>
{
  const user =  await Auth.currentAuthenticatedUser();
  // Returns an array of groups
  const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
  return groups;
}

  getRole() {
    this.roleAs = localStorage.getItem('ROLE');
    return this.roleAs;
  }
}
