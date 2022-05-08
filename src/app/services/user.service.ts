import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { API } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user : any;
  constructor() { }

  async getUserByEmail(userEmail: string) {
    var user = <User>{};

    user = await API.get('hotelAPI', '/user/' + userEmail, {}).then(resp => {
      console.log(resp);
      return resp;
    }).catch(err => {
      console.log(err);
    });
   return user;
  }

  async createuser(user: User) {
    let myInit = {
      body: user,
      headers: {},
    }

    this.user = await API.post('hotelAPI', '/user', myInit).then(resp => {
      return resp;
    }).catch(err => {
      console.log(err);
    });
    console.log(this.user);
    return this.user;
  }

  async updateuser(user: User) {
    let myInit = {
      body: user,
      headers: {},
    }

    this.user = await API.put('hotelAPI', '/user', myInit).then(resp => {
      return resp;
    }).catch(err => {
      console.log(err);
    });
    console.log(this.user);
    return this.user;
  }
}
