import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';
import { CountriesComponent } from './pages/countries/countries.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { TableCountriesComponent } from './components/table-countries/table-countries.component';
import { ModalCountriesComponent } from './components/modal-countries/modal-countries.component';


@NgModule({
  declarations: [
    CountriesComponent,
    TableCountriesComponent,
    ModalCountriesComponent
  ],
  imports: [
    CommonModule,
    CountriesRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class CountriesModule { }
