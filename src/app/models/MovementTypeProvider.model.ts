export class MovementTypeProvider {
  constructor(
    public name_movement: string,
    public key_movement: string,
    public type: string,
    public invoice: boolean,
    public status: boolean,
    public _id?: string
  ){}
}
