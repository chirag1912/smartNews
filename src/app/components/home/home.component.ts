import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AmenityType } from 'src/app/interfaces/amenityType';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CanActivate, Route, Router } from '@angular/router';
import { AfterContentInit, AfterViewChecked, Component, OnInit, OnChanges, AfterViewInit, DoCheck, SimpleChanges, Input } from '@angular/core';
import { Auth } from 'aws-amplify';
import { HotelService } from 'src/app/services/hotel.service';
import { Hotel } from 'src/app/interfaces/hotel';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  panelOpenState = false;
  cities = new Array<String>();
  hotels?: Array<Hotel> = [];
  hotelList?: Array<Hotel> = [];
  amenity: any;
  selectedData : any;
  matEndDate : any; 
  matStartDate : any;
  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
  ];

 
  available_hotel : string[] = ['Caesars Palace','Hyatt Regency', 'Holiday Inn & Suites Silicon Valley', 'Radisson '];
  user: any;
  public booking_date_to='';
  public booking_date_from='';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  minDate: Date = new Date();

  // hotels : Array<Hotel> ;

  constructor(private _snackBar: MatSnackBar,private _authService : AuthService, private _router : Router , private hotelService : HotelService) { 
    console.log(" constructor");
  
  }
  async ngOnInit() : Promise<void> {

    this.hotelList = await this.hotelService.getHotelList();
    this.hotels =this.hotelList
    this.updateImagesInHotelList(this.hotelList!);
    this.cities = await this.hotelService.getAllLocationNames(this.hotelList); 
    //TODO: commented by aakanksha
    // var hotel = await this.hotelService.getHotelById("hotel101");
  }
  
  updateImagesInHotelList (hotelList : Array<Hotel>)
  {
    console.log("Initial loaded hotel list");
console.log(hotelList);
  }
//called for search
  async searchHotels()
  {
   this.hotelList = []; 
   let hotelByLocs = await this.hotelService.getHotelByLocation(this.hotels, this.selectedData.value);
   console.log("get hotels by location");
   console.log(hotelByLocs);

 console.log(this.range.controls['start'].value);
   for (let i = 0 ; i < hotelByLocs.length ; i++)
   {
     
    let updatedRoomDetails = await this.hotelService.getAvailableRoomsBetweenDates(hotelByLocs[i],this.range.controls['start'].value, this.range.controls['end'].value)
     if (updatedRoomDetails.numberOfSingleRooms == 0 || updatedRoomDetails.numberOfDblRooms == 0 || updatedRoomDetails.numberOfSuites == 0)
     {
      // rooms not available.. 
     }
     else 
     {
    //  this.amenity = await this.amenitiesService.getAmenityForHotelId(updatedRoomDetails.adminId!);
     updatedRoomDetails.amenities = this.amenity[0].amenities; 
     console.log("check amaneities");
     console.log(updatedRoomDetails);
     this.hotelList!.push(updatedRoomDetails);  
     }
    }

  }

  selectedValue(event: MatSelectChange) {
    this.selectedData = {
      value: event.value,
      text: event.source.triggerValue
    };
    console.log(this.selectedData);
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
    // this.range.controls['end'].setValue(this.range.controls['start'].value + 7);
  }

}
