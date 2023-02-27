import { Ceco } from './Ceco.model';
import { Provider } from './Provider.model';
import { User } from './User.model';
import { Divisa } from './Divisa.model';
import { MovementTypeProvider } from './MovementTypeProvider.model';


export class InvoiceProviders {
  constructor(
    public ceco: Ceco,
    public provider: Provider,
    public key_invoice: string,
    public upload_date: number,
    public invoice_date: number,
    public invoice_total: string,
    public divisa: Divisa,
    public description: string,
    public movement_type: MovementTypeProvider,
    public activities?: any[],
    public expiration_date?: number,
    public followers?: any[],
    public user?: User,
    public contract?: string,
    public status?: string,
    public flow_id?: string,
    public remesa?: string,
    public _id?: string
  ) { }
}
