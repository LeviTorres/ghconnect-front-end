import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvidersComponent } from './pages/providers/providers.component';
import { AddProvidersComponent } from './pages/add-providers/add-providers.component';
import { PageProvidersComponent } from './pages/page-providers/page-providers.component';

const routes: Routes = [
  {
    path: '',
    component: ProvidersComponent,
    children: [
      { path: '', component: PageProvidersComponent },
      { path: 'add-provider', component: AddProvidersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
