// import { User } from './../../../interfaces/user';
// import { AuthServiceService } from './../../../services/auth-service.service';
// import { HotelService } from './../../../services/hotel.service';
// import { Hotel } from './../../../interfaces/hotel';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { HotelService } from 'src/app/services/hotel.service';
import { Hotel } from 'src/app/interfaces/hotel';
import { Route, Router } from '@angular/router';
// import { Component, OnInit, Injectable } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Bookings } from 'src/app/interfaces/bookings';
import { BookingService } from 'src/app/services/booking.service';
// import { BookingType} from 'src/app/interfaces/bookings'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { userInfo } from 'os';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  hotelId!: string;
  hotelDetail?: any;
  bookingdate_range: FormGroup;
  bookingdate_range_second: FormGroup;
  userDetailsFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  usernameFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  emailFormGroup: FormGroup;


  isEditable = true;
  selectedValue: string = '';
  mealList: any;
  public hotel_name = '';
  public booking_name = '';
  public booking_type = '';
  public no_of_guest = '';
  amenities: any;
  public booking_date_to = '';
  public booking_date_from = ''
  public total = 700;
  public singleroom_no = '';
  public doubleroom_no = '';
  public suit_no = '';

  matEndDate: any;
  matStartDate: any;

  createbooking: any;
  isLinear = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Wifi'];
  allFruits: string[] = ['Wifi', 'Parking', 'Lunch', 'Breakfast', 'Dinner'];

  // booking.. 
  // booking!: Bookings;
  userLoggedIn?: Promise<boolean>;
  user: boolean = false;
  useremail: string = "";
  updatedbooking?: Bookings;

  // et min date for selection
  minDate: Date;
  userDetail?: any;
  redeemPointsCheckBox?: boolean;
  rewards?: any;
  netPaid?: any;
  totalAmount?: any;

  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;

  constructor(private userservice: UserService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, public bookingservice: BookingService, private _router: Router, private hotelService: HotelService, private authService: AuthService) {

    // this.minDate = { year: this.year, month: this.month, day: this.day };
    this.minDate = new Date();

    if (this._router.url.split('/').length > 2) {
      this.hotelId = this._router.url.split('/')[2];
      console.log(this.hotelId);
      this.getHotelDetail(this.hotelId);


    }



    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDate();
    this.bookingdate_range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
    this.bookingdate_range_second = new FormGroup({
      start: new FormControl(new Date(year, month, day)),
      end: new FormControl(new Date(year, month, 16)),
    });

    this.firstFormGroup = _formBuilder.group({
      title: _formBuilder.control('initial value')
    });

    this.secondFormGroup = _formBuilder.group({
      title: _formBuilder.control('initial value')
    });

    this.thirdFormGroup = _formBuilder.group({
      title: _formBuilder.control('initial value'),
      singleroom_no: new FormControl({ value: 0 }),
      doubleroom_no: new FormControl({ value: 0 }),
      suites_no: new FormControl({ value: 0 }),
      singleroom_guestsize: new FormControl({ value: 0 }),
      doubleroom_guestsize: new FormControl({ value: 0 }),
      suites_guestsize: new FormControl({ value: 0 }),
      singleroom_amenities: new FormControl({ value: 0 }),
      doubleroom_amenities: new FormControl({ value: 0 }),
      suites_amenities: new FormControl({ value: 0 })
    });

    this.usernameFormGroup = _formBuilder.group({
      username: new FormControl()
    });

    this.addressFormGroup = _formBuilder.group({
      address: new FormControl()
    });

    this.emailFormGroup = _formBuilder.group({
      email: new FormControl()
    });

    this.userDetailsFormGroup = _formBuilder.group({
      title: _formBuilder.control('initial value')
    });

  }
  async getHotelDetail(hotelId: string) {
    this.hotelDetail = await this.hotelService.getHotelById(hotelId);
    console.log("-------Hotel List-------");
    console.log(this.hotelDetail);

  }

  redeemPoints(checked: any) {
    console.log(checked);
    this.redeemPointsCheckBox = checked;
    this.netPaid = this.totalAmount - this.rewards!;
    if (checked)
    { 
      this.updatedbooking!.paidAmount = this.netPaid; 
      // this.totalAmount = 
    }
    else
    {
      this.updatedbooking!.paidAmount = this.totalAmount; 
    }
  }

  async ngOnInit() {

    this.firstFormGroup.reset({ title: 'new value' });
    this.secondFormGroup.reset({ title: 'new value' });
    this.thirdFormGroup.reset({ title: 'new value' })
    this.userDetailsFormGroup.reset({ title: 'new value' });

    //get loggedin user-id
    this.userLoggedIn = this.authService.isLoggedIn();
    this.user = await this.userLoggedIn;
    if (this.user == true) {
      let resp = await this.authService.getUserDetails();
      this.useremail = resp.attributes.email;
      console.log(this.useremail);
      this.userDetail = await this.userservice.getUserByEmail(this.useremail);
      console.log("------userdetail----");
      console.log(this.userDetail[0]);
      this.rewards = this.userDetail[0].rewards;
      console.log("------reward points----");
      console.log(this.rewards);
    }
    else {
      //get userdetails from screen input.. 

    }
  }


  async onSubmit(): Promise<void> {
    // create entry in booking table
    let resp = await this.bookingservice.createBooking(this.updatedbooking);

    console.log(resp);
    // let currentBooking = this.getBookingScreenDetails();
    let user: any;
    user = await this.userservice.getUserByEmail(this.useremail);
    console.log("user structure stored in db....");
    console.log(user);
    if (user.length > 0) {
      // update user
      console.log("user present in db");
      user[0].bookings.push(this.updatedbooking);
    
      user[0].rewards = user[0].rewards + this.totalAmount/100;
      console.log(user);
      this.userservice.updateuser(user[0]);


    }
    else {
      // create user
      console.log("user not present in db");
      let user: User = {
        userEmail: this.useremail,
        username: this.usernameFormGroup.controls['username'].value,
        useraddress: this.addressFormGroup.controls['address'].value,
        bookings: [],
        rewards: 0
      }
      // let user = this.createUserPayload();
      console.log(user);
      user.bookings.push(this.updatedbooking!);
      user.rewards = this.updatedbooking!.paidAmount / 100;
      this.userservice.createuser(user);

      //TODO: create cognito account using email address passed from input field... 

    }

    console.log("------update hotel entry ------");
    this.hotelDetail.bookings.push(this.updatedbooking);
    this.hotelService.updateHotel(this.hotelDetail);
    this._snackBar.open("Booking created. Paid $" + this.updatedbooking?.paidAmount, 'Cancel', {
      duration: 3000
    });

    this._router.navigate(['/']);
    
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }


  // called on click of next button
  async getTotalPricing() {
    let booking = this.getBookingScreenDetails();
    this.updatedbooking = await this.bookingservice.getPricingforBooking(booking);
    console.log("Updated Bookings");
    console.log(this.updatedbooking);
    this.totalAmount = this.updatedbooking!.paidAmount;
  }

  check7Days(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log("check7Days");
    console.log(event);
    if (event.value?.getDate()! - this.range.controls['start'].value.getDate() > 7) {
      this._snackBar.open("Select date upto 1 week", 'Cancel', {
        duration: 3000
      });
      this.range.controls['start'].setValue('');
      this.range.controls['end'].setValue('');
    }
  }


  getBookingScreenDetails() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length: number) {
      let result = ' ';
      const charactersLength = characters.length;
      for (let i = length; i > 0; i--) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    let booking: Bookings = {
      hotelId: this.hotelId,
      userEmail: this.useremail,
      fromBookingDate: this.range.controls['start'].value,
      toBookingDate: this.range.controls['end'].value,
      bookingId: generateString(6).trim(),
      userName: this.usernameFormGroup.controls['username'].value,
      userAddress: this.addressFormGroup.controls['address'].value,
      status: 'New',
      singleRoomBooking: {
        numberOfRooms: this.thirdFormGroup.controls['singleroom_no'].value,
        numberOfGuests: this.thirdFormGroup.controls['singleroom_guestsize'].value,
        amenities: {
          dailycomplimentaryBreakfast: true,
          parking: true,
          fitnessRoom: true,
          swimmingPool: true,
          jacuzzi: true,
          allmeals: true
        },
        cost: 0
      },
      doubleRoomBooking: {
        numberOfRooms: this.thirdFormGroup.controls['doubleroom_no'].value,
        numberOfGuests: this.thirdFormGroup.controls['doubleroom_guestsize'].value,
        amenities: {
          dailycomplimentaryBreakfast: true,
          parking: true,
          fitnessRoom: true,
          swimmingPool: true,
          jacuzzi: true,
          allmeals: true
        },
        cost: 0
      },
      suiteBooking: {
        numberOfRooms: this.thirdFormGroup.controls['suites_no'].value,
        numberOfGuests: this.thirdFormGroup.controls['suites_guestsize'].value,
        amenities: {
          dailycomplimentaryBreakfast: true,
          parking: true,
          fitnessRoom: true,
          swimmingPool: true,
          jacuzzi: true,
          allmeals: true
        },
        cost: 0
      },

      paidAmount: 0
    }
    return booking;
  }
  createUserPayload() {
    let user: User = {
      userEmail: this.useremail,
      username: this.usernameFormGroup.controls['username'].value,
      useraddress: this.addressFormGroup.controls['address'].value,
      bookings: [],
      rewards: 0
    }
    return user;
  }


}
