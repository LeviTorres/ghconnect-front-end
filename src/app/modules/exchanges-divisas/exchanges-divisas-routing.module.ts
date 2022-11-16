import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangesDivisasComponent } from './pages/exchanges-divisas/exchanges-divisas.component';
import { MainComponent } from './pages/main/main.component';
import { DetailsExchangesComponent } from './pages/details-exchanges/details-exchanges.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', component:ExchangesDivisasComponent},
      {path: 'details-exchanges', component: DetailsExchangesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangesDivisasRoutingModule { }
