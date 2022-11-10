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

export class Country {
  constructor(
    public name: string,
    public nationality: string,
    public user?: _user,
    public divisa?: _divisa,
    public _id?: string
  ){}
}
