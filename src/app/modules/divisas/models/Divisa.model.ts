interface _user {
  name: string,
  last_name: string,
  _id: string,
}

export class Divisa {
  constructor(
    public name: string,
    public abbreviation_divisa: string,
    public symbol: string,
    public user?: _user,
    public _id?: string
  ){}
}
