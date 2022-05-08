import { PreviousreservationComponent } from './components/previousreservation/previousreservation.component';
import { LoginComponent } from './components/login/login.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { UserComponent } from './components/user/user.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { BookingComponent } from './components/booking/booking.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
// const routes: Routes = [];

const routes: Routes = [
    
  { path: '',component : HomeComponent },
  {path : 'admin', component:AdminComponent,canActivate: [AuthGuard],
  data: {
    role: 'admins'
  }},
  {path : 'booking',component:BookingComponent},
  {path : 'booking/:id',component:BookingComponent},
  {path: 'contacts',component:ContactsComponent},
  {path: 'user',component: UserComponent},
  {path:'reservations',component :ReservationsComponent},
  {path:'rewards',component :RewardsComponent}, 
  {path:'login',component :LoginComponent},
  {path:'previousreservations',component :PreviousreservationComponent}
  
  //  { path: 'layout/navbar',component : NavbarComponent }
  
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
