import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './pages/workspace/workspace.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspacesRoutingModule { }
