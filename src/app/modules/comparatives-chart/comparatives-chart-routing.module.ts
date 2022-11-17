import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComparativesChartComponent } from './pages/comparatives-chart/comparatives-chart.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: ComparativesChartComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparativesChartRoutingModule { }
