import { environment } from '../../environments/environment'
import { Business } from './Business.model';

const base_url = environment.base_url

export class User {
  constructor(
    public name: string,
    public last_name: string,
    public email: string,
    public tenant: any,
    public password?: string,
    public img?: string,
    public role?: string,
    public _id?: string
  ){}

  get getImage(){
    if(this.img) {
      return `${ base_url }/upload/users/${ this.img }`
    }else {
      return `${ base_url }/upload/users/image`
    }
  }
}
