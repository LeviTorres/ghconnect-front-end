import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComparativesChartComponent } from './pages/comparatives-chart/comparatives-chart.component';
import { MainComponent } from './pages/main/main.component';
import { AddComparativesChartComponent } from './pages/add-comparatives-chart/add-comparatives-chart.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparativesChartRoutingModule { }
