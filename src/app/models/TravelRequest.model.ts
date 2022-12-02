import { User } from './User.model';
import { Business } from './Business.model';

interface Authorizers{
  user: string
  required: boolean
  message?: string
}

export class TravelRequest {
  constructor(
    public key_employee: string,
    public name_applicant: string,
    public business: Business,
    public cost_center: string,
    public departure_date: number,
    public return_date: number,
    public origin_city: string,
    public destination_city: string,
    public reason_trip: string,
    public lodging: boolean,
    public vehicle: boolean,
    public authorizers: any,
    public status: string,
    public observations?: string,
    public createdAt?: string,
    public updatedAt?: string,
    public user?: User,
    public _id?: string
  ){}
}
