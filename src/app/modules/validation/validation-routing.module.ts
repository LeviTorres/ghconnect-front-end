import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../comparatives-chart/pages/main/main.component';
import { ComparativesChartComponent } from '../comparatives-chart/pages/comparatives-chart/comparatives-chart.component';
import { AddComparativesChartComponent } from '../comparatives-chart/pages/add-comparatives-chart/add-comparatives-chart.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: ComparativesChartComponent},
      { path: 'add-comparative-chart', component: AddComparativesChartComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationRoutingModule { }
