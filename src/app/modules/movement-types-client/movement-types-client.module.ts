import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovementTypesClientRoutingModule } from './movement-types-client-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from 'src/app/components/navbar/navbar.module';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { MainComponent } from './pages/main/main.component';
import { AddMovementTypesComponent } from './pages/add-movement-types/add-movement-types.component';
import { EditMovementTypesComponent } from './pages/edit-movement-types/edit-movement-types.component';
import { MovementTypesComponent } from './pages/movement-types/movement-types.component';
import { TableMovementTypesComponent } from './components/table-movement-types/table-movement-types.component';


@NgModule({
  declarations: [
    MainComponent,
    AddMovementTypesComponent,
    EditMovementTypesComponent,
    MovementTypesComponent,
    TableMovementTypesComponent
  ],
  imports: [
    CommonModule,
    MovementTypesClientRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class MovementTypesClientModule { }
