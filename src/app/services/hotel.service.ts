import { Injectable } from '@angular/core';
import { Hotel } from '../interfaces/hotel';
import { API } from 'aws-amplify';
import { Bookings } from '../interfaces/bookings';
@Injectable({
  providedIn: 'root'
})
export class HotelService {
  hotelList?: Array<Hotel> = [];
  amenity: any;
  constructor() { }


async getHotelById(hotelId: string) {
  var hotel = <Hotel>{};
  hotel  = await API.get('hotelAPI', '/goibibohotels/' + hotelId, {}).then(resp => {
    console.log(resp);
    return resp[0];
  }).catch(err => {
    console.log(err);
  });
 return hotel;
}
  
async getBookingForAdmin(hotelEmail: string) {
  var hotel = <Hotel>{};
 let hotelList = await this.getHotelList(); 
 for (let i = 0 ; i < hotelList?.length! ; i++)
 {
    if (hotelList![i].adminEmail == hotelEmail)
    {
return hotelList![i];
    }
 }
 return hotel;
}

  async updateHotel(hotel: Hotel) {
    let myInit = {
      body: hotel,
      headers: {},
    }

    this.hotelList = await API.put('hotelAPI', '/goibibohotels', myInit).then(resp => {
      return resp;
    }).catch(err => {
      console.log(err);
    });
    console.log(this.hotelList);
    return this.hotelList;
  }

  async getHotelList() {
   this.hotelList = await API.get('hotelAPI', '/goibibohotels/all', {}).then(resp => {
      return resp;
    }).catch(err => {
      console.log(err);
    });

    // for (let i = 0 ; i < this.hotelList?.length! ; i++)
    // {
    //   console.log("amenity list");
    // // console.log(this.hotelList);
    //   this.amenity = await this.amenitiesService.getAmenityForHotelId(this.hotelList![i].adminId);
    //   this.hotelList![i].amenities = this.amenity[0].amenities;
    //   // console.log(this.amenity);
    // }
    
    return this.hotelList;
  }

  async getAllLocationNames(hotels: any){  

    var names= new Array<String>();
    for(var i=0; i< hotels.length ; i++ ){
      if(!names.includes(hotels[i].Location)){
        names.push(hotels[i].Location);
  }

    }
    console.log("allHotelLocations");
    console.log(names);
    return names;
  }

  // get hotels by location. 

  async getHotelByLocation( hotels: any, requestedLocation: string){
   var hotelsByLocation = new Array<Hotel>(); 
     
      for(var i=0; i< hotels.length ; i++ ){
          if(hotels[i].Location.match(requestedLocation)){
            hotelsByLocation.push(hotels[i]);
      } 

    }
    console.log("Hotel List by location");
    console.log(hotelsByLocation);
    
    return hotelsByLocation;
  }

  
  async  getAvailableRoomsBetweenDates(hotel: Hotel, fromDate: Date , toDate : Date) {

    var from = new Date(fromDate);      
    var to = new Date(toDate);

      var availableNumberOfSingleRooms = hotel.numberOfSingleRooms;
      var availableNumberOfDblRooms= hotel.numberOfDblRooms
      var availableNumberOfSuites= hotel.numberOfSuites;
  
           var hotelBookings = new Array<Bookings>();
           hotelBookings = hotel.bookings;

            for(var j=0;j<hotelBookings.length;j++){

              var booking = hotelBookings[j];

             var bookingFrom = new Date(booking.fromBookingDate);
             var bookingTo = new Date(booking.toBookingDate);

              if( (from >= bookingFrom && from <= bookingTo) || 
              (to >= bookingFrom && to <= bookingTo)){

                availableNumberOfSingleRooms = availableNumberOfSingleRooms - Number(booking.singleRoomBooking.numberOfRooms);
                availableNumberOfDblRooms = availableNumberOfDblRooms - Number(booking.doubleRoomBooking.numberOfRooms);
                availableNumberOfSuites = availableNumberOfSuites - Number(booking.suiteBooking.numberOfRooms);
              }

            }

            var availabilityOfAllRooms= new Array<number>();
            availabilityOfAllRooms.push(availableNumberOfSingleRooms);
            availabilityOfAllRooms.push(availableNumberOfDblRooms);
            availabilityOfAllRooms.push(availableNumberOfSuites);

            console.log(availabilityOfAllRooms);
             hotel.numberOfSingleRooms = availableNumberOfSingleRooms; 
             hotel.numberOfDblRooms = availableNumberOfDblRooms; 
             hotel.numberOfSuites = availableNumberOfSuites;
            
            return hotel;
            
      }
}
