import { Bookings } from 'src/app/interfaces/bookings';

export interface User {
    userEmail: string, 
    username: string, 
    useraddress:string, 
    rewards: number,
    bookings: Array<Bookings>
}