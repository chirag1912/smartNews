import { AmenityCost } from "./amenityCost";
import { AmenityType } from "./amenityType";
import {  Bookings } from "./bookings";

export interface Hotel {
    
    adminId: string,
    name: string,
    desc: string,
    imageURL : URL,
    numberOfDblRooms : number,
    numberOfSingleRooms: number,
    numberOfSuites : number,
    Location: string,
    adminEmail : string,
    baseRateForDoubleRoom : number,
    baseRateForSingleRoom : number,
    baseRateForSuite : number,
    bookings: Bookings[],
    amenities: AmenityType,
    amenitiesPricing: AmenityCost
}