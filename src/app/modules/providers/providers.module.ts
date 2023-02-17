import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersComponent } from './pages/providers/providers.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { AddProvidersComponent } from './pages/add-providers/add-providers.component';
import { TableProvidersComponent } from './components/table-providers/table-providers.component';
import { PageProvidersComponent } from './pages/page-providers/page-providers.component';
import { EditProviderComponent } from './pages/edit-provider/edit-provider.component';
import { ImportFileComponent } from './components/import-file/import-file.component';


@NgModule({
  declarations: [
    ProvidersComponent,
    AddProvidersComponent,
    TableProvidersComponent,
    PageProvidersComponent,
    EditProviderComponent,
    ImportFileComponent
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class ProvidersModule { }
