import { User } from './User.model';

export class Volume {
  constructor(
    public insumo: string,
    public front: string,
    public card: string,
    public description: string,
    public departure: string,
    public measure: string,
    public project_volume: number,
    public units_purchased: number,
    public price_proforma: number,
    public type: 'initial' | 'plus' | 'minus' | 'buys',
    public pending_to_buy?: number,
    public createdAt?: string,
    public updatedAt?: string,
    public user?: User,
    public _id?: string
  ){}
}
