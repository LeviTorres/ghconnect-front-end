import { User } from './User.model';
import { Business } from './Business.model';

interface Authorizers{
  user: User
  required: boolean
  message?: string
  status: '' | 'CANCELLED' | 'ACCEPTED'
}

interface History {
  user: User
  date: number
  action: string
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
    public history: History[],
    public lodging: boolean,
    public vehicle: boolean,
    public authorizers: Authorizers[] ,
    public status: 'TOSEND' | 'SEND' | 'PASSED' | 'REFUSED' | 'CANCELLED',
    public observations?: string,
    public createdAt?: string,
    public updatedAt?: string,
    public user?: User,
    public _id?: string
  ){}
}
