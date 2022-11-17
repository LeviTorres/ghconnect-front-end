import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolumesRoutingModule } from './volumes-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { VolumesComponent } from './pages/volumes/volumes.component';
import { AddVolumesComponent } from './components/add-volumes/add-volumes.component';
import { TableVolumesComponent } from './components/table-volumes/table-volumes.component';
import { DetailsVolumesComponent } from './pages/details-volumes/details-volumes.component';
import { MainComponent } from './pages/main/main.component';
import { AddNewVolumeComponent } from './components/add-new-volume/add-new-volume.component';



@NgModule({
  declarations: [
    VolumesComponent,
    AddVolumesComponent,
    TableVolumesComponent,
    DetailsVolumesComponent,
    MainComponent,
    AddNewVolumeComponent
  ],
  imports: [
    CommonModule,
    VolumesRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class VolumesModule { }
