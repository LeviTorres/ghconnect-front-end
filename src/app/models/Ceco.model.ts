interface _user {
  name: string,
  last_name: string,
  _id: string,
}

interface _country {
  name: string
  nationality: string
  _id: string
}

interface _business {
  name: string
  name_short: string
  key_business: string
  _id: string
  country: _country
}

export class Ceco {
  constructor(
    public name_large: string,
    public name_short: string,
    public key_ceco: string,
    public key_ceco_business: string,
    public user?: _user,
    public business?: _business,
    public _id?: string
  ){}
}
