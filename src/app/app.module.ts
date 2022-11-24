import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
import { DatecustomPipe } from './pipes/datecustom.pipe';
import { MAT_DATE_LOCALE } from '@angular/material/core';
registerLocaleData(localeEs, 'es')

@NgModule({
  declarations: [
    AppComponent,
    DatecustomPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
