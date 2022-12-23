import { User } from './User.model';
import { Business } from './Business.model';
import { Ceco } from './Ceco.model';
import { Divisa } from './Divisa.model';

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

export class FinaceRequest {
  constructor(
    public creation_date: number,
    public key_policy: string,
    public policy_type: string,
    public ceco: Ceco,
    public business: Business,
    public payer: string,
    public beneficiary: string,
    public main_contract_value: number,
    public divisa_main_value: Divisa,
    public guaranteed_sum: number,
    public divisa_guaranteed_sum: Divisa,
    public equivalent_value: number,
    public start_date: number,
    public finish_date: number,
    public policy_validity: string,
    public insurance_object: string,
    public process_execution: string,
    public premium_pay: number,
    public payment_conditions: string,
    public history: History[],
    public authorizers: Authorizers[],
    public status: 'TOSEND' | 'SEND' | 'PASSED' | 'REFUSED' | 'CANCELLED',
    public createdAt?: string,
    public updatedAt?: string,
    public user?: User,
    public _id?: string
  ){}
}
