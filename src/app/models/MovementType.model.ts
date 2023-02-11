export class MovementType {
  constructor(
    public name_movement: string,
    public key_movement: string,
    public type: string,
    public invoice: boolean,
    public _id?: string
  ){}
}
