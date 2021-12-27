import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanetComponent } from './planet/planet.component';
import { PlanetsComponent } from './planets.component';

const routes: Routes = [
  {
    path: '',
    component: PlanetsComponent
  },
  {
    path: ':id',
    component: PlanetComponent,
    data: {
      pageTitle: 'View Planet'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanetsRoutingModule { }
