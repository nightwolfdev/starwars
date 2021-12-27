import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SpecieComponent } from './specie/specie.component';
import { SpeciesComponent } from './species.component';

const routes: Routes = [
  {
    path: '',
    component: SpeciesComponent
  },
  {
    path: ':id',
    component: SpecieComponent,
    data: {
      pageTitle: 'View Specie'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeciesRoutingModule { }
