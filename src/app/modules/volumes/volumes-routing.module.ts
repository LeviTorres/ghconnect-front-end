import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VolumesComponent } from './pages/volumes/volumes.component';
import { DetailsExchangesComponent } from '../exchanges-divisas/pages/details-exchanges/details-exchanges.component';
import { DetailsVolumesComponent } from './pages/details-volumes/details-volumes.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: VolumesComponent},
      { path: 'details-volumes', component: DetailsVolumesComponent}
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolumesRoutingModule { }
