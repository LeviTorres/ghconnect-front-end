import { environment } from '../../../../environments/environment'

const base_url = environment.base_url

export class User {
  constructor(
    public name: string,
    public last_name: string,
    public email: string,
    public password?: string,
    public img?: string,
    public role?: string,
    public _id?: string
  ){}

  get getImage(){
    if(this.img) {
      return `${ base_url }/uploads/users/${ this.img }`
    }else {
      return `${ base_url }/uploads/users/image`
    }
  }
}
