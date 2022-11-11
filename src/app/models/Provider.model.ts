interface _user {
  name: string,
  last_name: string,
  _id: string,
}

export class Provider {
  constructor(
    public key_provider: string,
    public name: string,
    public nit: string,
    public third_type: string,
    public society_type: string,
    public provider_type: string,
    public phone_number: string,
    public mobile_number: string,
    public email: string,
    public status: string,
    public payment_conditions: string,
    public user?: _user,
    public _id?: string
  ){}
}
