import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-document-finace-request',
  templateUrl: './add-document-finace-request.component.html',
  styleUrls: ['./add-document-finace-request.component.scss']
})
export class AddDocumentFinaceRequestComponent implements OnInit {

  public form: FormGroup = new FormGroup({
    type_document: new FormControl('', Validators.required),
    description: new FormControl(''),
    document: new FormControl('')
  })

  constructor(
    private _toastr:ToastrService,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.form.controls['type_document'].valueChanges.subscribe((value:any) => {
      console.log('value',value);
    })
    this.form.controls['description'].valueChanges.subscribe((value:any) => {
      console.log('description',value);
    })
  }

  handleImage(event: any){
    console.log(event.target.files[0]);
    this.form.controls['document'].setValue(event.target.files[0])
  }

  addDocument(){
    this._spinner.show()
    if(this.form.invalid){
      this._spinner.hide()
      return
    }
    if(!this.form.controls['document'].value){
      this._spinner.hide()
      this._toastr.warning('Seleciona un documento')
      return
    }
    console.log(this.form.controls['document'].value);
    console.log(this.form.value);
    this._spinner.hide()
  }



}
