import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'divisas',
    loadChildren: () => import('./modules/divisas/divisas.module').then(m => m.DivisasModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'exchanges',
    loadChildren: () => import('./modules/exchanges/exchanges.module').then(m => m.ExchangesModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'volumes',
    loadChildren: () => import('./modules/volumes/volumes.module').then(m => m.VolumesModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'exchanges-divisas',
    loadChildren: () => import('./modules/exchanges-divisas/exchanges-divisas.module').then(m => m.ExchangesDivisasModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'countries',
    loadChildren: () => import('./modules/countries/countries.module').then(m => m.CountriesModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'cecos',
    loadChildren: () => import('./modules/cecos/cecos.module').then(m => m.CecosModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'business',
    loadChildren: () => import('./modules/business/business.module').then(m => m.BusinessModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'operations',
    loadChildren: () => import('./modules/operations/operations.module').then(m => m.OperationsModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'validation',
    loadChildren: () => import('./modules/validation/validation.module').then(m => m.ValidationModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'control',
    loadChildren: () => import('./modules/control/control.module').then(m => m.ControlModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'treasury',
    loadChildren: () => import('./modules/treasury/treasury.module').then(m => m.TreasuryModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'invoice-providers',
    loadChildren: () => import('./modules/invoice-providers/invoice-providers.module').then(m => m.InvoiceProvidersModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'invoice-clients',
    loadChildren: () => import('./modules/invoice-clients/invoice-clients.module').then(m => m.InvoiceClientsModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'providers',
    loadChildren: () => import('./modules/providers/providers.module').then(m => m.ProvidersModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'clients',
    loadChildren: () => import('./modules/clients/clients.module').then(m => m.ClientsModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'contracts',
    loadChildren: () => import('./modules/contracts/contracts.module').then(m => m.ContractsModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'approvals',
    loadChildren: () => import('./modules/approvals/approvals.module').then(m => m.ApprovalsModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
    canActivate:[ AuthGuard ]
  },
  {
    path: '**', redirectTo: 'home', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
