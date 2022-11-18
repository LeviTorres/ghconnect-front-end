import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComparativesChartRoutingModule } from './comparatives-chart-routing.module';
import { ComparativesChartComponent } from './pages/comparatives-chart/comparatives-chart.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { MainComponent } from './pages/main/main.component';
import { AddComparativesChartComponent } from './pages/add-comparatives-chart/add-comparatives-chart.component';
import { TableComparativesChartComponent } from './components/table-comparatives-chart/table-comparatives-chart.component';


@NgModule({
  declarations: [
    ComparativesChartComponent,
    MainComponent,
    AddComparativesChartComponent,
    TableComparativesChartComponent
  ],
  imports: [
    CommonModule,
    ComparativesChartRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ],
  exports: [
    ComparativesChartComponent,
    MainComponent,
    AddComparativesChartComponent,
    TableComparativesChartComponent
  ]
})
export class ComparativesChartModule { }
