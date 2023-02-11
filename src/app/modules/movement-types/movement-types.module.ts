import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovementTypesRoutingModule } from './movement-types-routing.module';
import { MovementTypesComponent } from './pages/movement-types/movement-types.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { TableMovementTypesComponent } from './components/table-movement-types/table-movement-types.component';
import { AddMovementTypesComponent } from './pages/add-movement-types/add-movement-types.component';
import { EditMovementTypesComponent } from './pages/edit-movement-types/edit-movement-types.component';
import { MainComponent } from './pages/main/main.component';


@NgModule({
  declarations: [
    MovementTypesComponent,
    TableMovementTypesComponent,
    AddMovementTypesComponent,
    EditMovementTypesComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    MovementTypesRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class MovementTypesModule { }
