import { HotelService } from './hotel.service';
import { Hotel } from './../interfaces/hotel';
import { Bookings } from './../interfaces/bookings';
import { Injectable } from '@angular/core';
import { API } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookingList?: Bookings;
  hotel?: Hotel;
  constructor(private hotelService: HotelService) { }

  async createBooking(booking: any) {
    let myInit = {
      body: booking,
      headers: {},
    }

    this.bookingList = await API.post('hotelAPI', '/bookings', myInit).then(resp => {
      return resp;
    }).catch(err => {
      console.log(err);
    });
    console.log(this.bookingList);
    return this.bookingList;
  }

  async getBookings() {
    this.bookingList = await API.get('hotelAPI', '/bookings/all', {}).then(resp => {
      return resp;
    }).catch(err => {
      console.log(err);
    });
    console.log("Current Bookings");
    console.log(this.bookingList);
    return this.bookingList;
  }

  async getPricingforBooking(booking: Bookings) {

    //we need to get the booking details from the booking object. eg: numberofsingle rooms , guests, dates etc
    // we check if dates fall between christams time/ summer time or on weekend
    // if the dates fall between any of these days, we will use the dynamicMultiplier of the hotel in the final 
    // pricing.

    var hotelId = booking.hotelId;
    var totalPriceBeforePeaks = 0;
    var totalPrice = 0;

    //we will get the hotel from here by calling the getHotelById method in hotel.service.ts
    var hotel = <Hotel>{};
    hotel = await this.hotelService.getHotelById("hotel101");
    debugger;

    var priceForSingleRoom;
    if (booking.singleRoomBooking.numberOfGuests != 1) {

      var extraGuests = Number(booking.singleRoomBooking.numberOfGuests) - 1;
      var extraprice = extraGuests * 0.5 * hotel.baseRateForSingleRoom; // we are charging 0.5 times the price for each extra guest
      priceForSingleRoom = (Number(booking.singleRoomBooking.numberOfRooms) * hotel.baseRateForSingleRoom) + extraprice;

    } else {
      priceForSingleRoom = Number(booking.singleRoomBooking.numberOfRooms) * hotel.baseRateForSingleRoom;
    }

    //calculating the amenities price for singleRoom

    if (booking.singleRoomBooking.amenities.allmeals) {
      priceForSingleRoom = priceForSingleRoom + hotel.amenitiesPricing.allmeals;
    }
    if (booking.singleRoomBooking.amenities.dailycomplimentaryBreakfast) {
      priceForSingleRoom = priceForSingleRoom + hotel.amenitiesPricing.dailycomplimentaryBreakfast
    }
    if (booking.singleRoomBooking.amenities.fitnessRoom) {
      priceForSingleRoom = priceForSingleRoom + hotel.amenitiesPricing.fitnessRoom;
    }
    if (booking.singleRoomBooking.amenities.jacuzzi) {
      priceForSingleRoom = priceForSingleRoom + hotel.amenitiesPricing.jacuzzi;
    }
    if (booking.singleRoomBooking.amenities.parking) {
      priceForSingleRoom = priceForSingleRoom + hotel.amenitiesPricing.parking;
    }
    if (booking.singleRoomBooking.amenities.swimmingPool) {
      priceForSingleRoom = priceForSingleRoom + hotel.amenitiesPricing.swimmingPool;
    }

    var priceForDoubleRoom;
    if (booking.doubleRoomBooking.numberOfGuests != 1) {

      var extraGuests = Number(booking.doubleRoomBooking.numberOfGuests) - 1;
      var extraprice = extraGuests * 0.5 * hotel.baseRateForDoubleRoom; // we are charging 0.5 times the price for each extra guest
      priceForDoubleRoom = (Number(booking.doubleRoomBooking.numberOfRooms) * hotel.baseRateForDoubleRoom) + extraprice;

    } else {
      priceForDoubleRoom = Number(booking.doubleRoomBooking.numberOfRooms) * hotel.baseRateForDoubleRoom;
    }

    //calculating the amenities price for singleRoom

    if (booking.doubleRoomBooking.amenities.allmeals) {
      priceForDoubleRoom = priceForDoubleRoom + hotel.amenitiesPricing.allmeals;
    }
    if (booking.doubleRoomBooking.amenities.dailycomplimentaryBreakfast) {
      priceForDoubleRoom = priceForDoubleRoom + hotel.amenitiesPricing.dailycomplimentaryBreakfast
    }
    if (booking.doubleRoomBooking.amenities.fitnessRoom) {
      priceForDoubleRoom = priceForDoubleRoom + hotel.amenitiesPricing.fitnessRoom;
    }
    if (booking.doubleRoomBooking.amenities.jacuzzi) {
      priceForDoubleRoom = priceForDoubleRoom + hotel.amenitiesPricing.jacuzzi;
    }
    if (booking.doubleRoomBooking.amenities.parking) {
      priceForDoubleRoom = priceForDoubleRoom + hotel.amenitiesPricing.parking;
    }
    if (booking.doubleRoomBooking.amenities.swimmingPool) {
      priceForDoubleRoom = priceForDoubleRoom + hotel.amenitiesPricing.swimmingPool;
    }



    var priceForSuite;

    if (booking.suiteBooking.numberOfGuests != 1) {

      var extraGuests = Number(booking.suiteBooking.numberOfGuests) - 1;
      var extraprice = extraGuests * 0.5 * hotel.baseRateForSuite; // we are charging 0.5 times the price for each extra guest
      priceForSuite = (Number(booking.suiteBooking.numberOfRooms) * hotel.baseRateForSuite) + extraprice;

    } else {
      priceForSuite = Number(booking.suiteBooking.numberOfRooms) * hotel.baseRateForSuite;
    }

    //calculating the amenities price for singleRoom

    if (booking.suiteBooking.amenities.allmeals) {
      priceForSuite = priceForSuite + hotel.amenitiesPricing.allmeals;
    }
    if (booking.suiteBooking.amenities.dailycomplimentaryBreakfast) {
      priceForSuite = priceForSuite + hotel.amenitiesPricing.dailycomplimentaryBreakfast
    }
    if (booking.suiteBooking.amenities.fitnessRoom) {
      priceForSuite = priceForSuite + hotel.amenitiesPricing.fitnessRoom;
    }
    if (booking.suiteBooking.amenities.jacuzzi) {
      priceForSuite = priceForSuite + hotel.amenitiesPricing.jacuzzi;
    }
    if (booking.suiteBooking.amenities.parking) {
      priceForSuite = priceForSuite + hotel.amenitiesPricing.parking;
    }
    if (booking.suiteBooking.amenities.swimmingPool) {
      priceForSuite = priceForSuite + hotel.amenitiesPricing.swimmingPool;
    }


    totalPriceBeforePeaks = priceForSingleRoom + priceForDoubleRoom + priceForSuite;


    // check if  the dates are weekends or seasonal holidays
    var from = new Date(booking.fromBookingDate);
    var to = new Date(booking.toBookingDate);

    // code to check if any date falls on a weekend
    var date = new Date();
    // var dayOfWeek = date.getDay();
    // var isWeekend = (dayOfWeek === 6) || (dayOfWeek  === 0); // 6 = Saturday, 0 = Sunday

    var d1 = new Date(booking.fromBookingDate);
    var d2 = new Date(booking.toBookingDate);
    var weekendDaysCount = 0;
    var isWeekend = false;
    var numberOfDays = 0;
    // need to test if it works for booking like tuesday to saturday
    while (d1 <= d2) {
      numberOfDays++;
      var day = d1.getDay();
      isWeekend = (day === 6) || (day === 0);
      if (isWeekend) {
        weekendDaysCount = weekendDaysCount + 1;
      }
      d1.setDate(d1.getDate() + 1);
    }

    var perDayPriceBeforePeaks = totalPriceBeforePeaks / numberOfDays;


    // we are adding the price of the weekenddays again. basically doubling the price for weekends
    totalPrice = totalPriceBeforePeaks + weekendDaysCount * perDayPriceBeforePeaks;


    // code for seasonal pricing for summer and christmas. we double the overall price for both seasons
    var christmasFrom = new Date(12 - 1 - 2022);
    var christmasTo = new Date(12 - 31 - 2022);
    var summerFrom = new Date(5 - 1 - 2022);
    var summerTo = new Date(7 - 31 - 2022);

    if ((from >= christmasFrom && from <= christmasTo) ||
      (to >= christmasFrom && to <= christmasTo)) {

      totalPrice = totalPrice * 2;

    }

    if ((from >= summerFrom && from <= summerTo) ||
      (to >= summerFrom && to <= summerTo)) {

      totalPrice = totalPrice * 2;

    }

    booking.singleRoomBooking.cost = priceForSingleRoom;
    booking.doubleRoomBooking.cost = priceForDoubleRoom;
    booking.suiteBooking.cost = priceForSuite;

    booking.paidAmount = totalPrice;


    return booking;

  }
}
