import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from '../list/list.module';
import { LoadingModule } from '../loading/loading.module';
import { PlanetsRoutingModule } from './planets-routing.module';

import { PlanetsComponent } from './planets.component';
import { PlanetComponent } from './planet/planet.component';

@NgModule({
  declarations: [
    PlanetsComponent,
    PlanetComponent
  ],
  imports: [
    CommonModule,
    ListModule,
    LoadingModule,
    PlanetsRoutingModule
  ]
})
export class PlanetsModule { }
