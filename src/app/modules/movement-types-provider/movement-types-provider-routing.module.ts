import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { MovementTypesComponent } from './pages/movement-types/movement-types.component';
import { AddMovementTypesComponent } from './pages/add-movement-types/add-movement-types.component';
import { EditMovementTypesComponent } from './pages/edit-movement-types/edit-movement-types.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: MovementTypesComponent },
      { path: 'add-movement-type', component: AddMovementTypesComponent},
      { path: 'edit-movement-type', component: EditMovementTypesComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementTypesProviderRoutingModule { }
