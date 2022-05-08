import { AmenityType } from "./amenityType";

export interface BookingType {
    numberOfRooms: Number, 
    numberOfGuests: Number,
    amenities: AmenityType,
    cost : number;
 }