import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    WorkspaceComponent
  ],
  imports: [
    CommonModule,
    WorkspacesRoutingModule,
    SharedModule
  ]
})
export class WorkspacesModule { }
