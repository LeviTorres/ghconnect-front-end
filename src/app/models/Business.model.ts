interface _user {
  name: string,
  last_name: string,
  _id: string,
}

interface _divisa {
  name:string,
  _id: string,
  symbol: string,
  abbreviation_name:string
}

interface _country {
  name: string,
  nationality: string,
  _id: string
  divisa: _divisa
}

export class Business {
  constructor(
    public name: string,
    public name_short: string,
    public key_business: string,
    public user?: _user,
    public country?: _country,
    public _id?: string
  ){}
}
