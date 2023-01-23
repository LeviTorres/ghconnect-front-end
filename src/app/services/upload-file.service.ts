import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor() { }

  async updateFile(file:File, type: string, id: string, ){
    try {
      const url = `${base_url}/upload/${type}/${id}`
      const formData = new FormData()
      formData.append('image', file)

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      })
      const data = await resp.json()
      return data
    } catch (error) {
      console.log(error);
      return false
    }

  }

}
