import { BookingType } from "./bookingType";

export interface Bookings {
    bookingId?:string,
    userEmail:string,
    userName:string, 
    userAddress:string,
    status:string,
    hotelId:any,
    toBookingDate:Date,
    fromBookingDate: Date,
    singleRoomBooking:BookingType,
    doubleRoomBooking:BookingType,
    suiteBooking:BookingType,
    paidAmount:number
}



