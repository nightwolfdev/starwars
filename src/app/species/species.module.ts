import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from '../list/list.module';
import { LoadingModule } from '../loading/loading.module';
import { SpeciesRoutingModule } from './species-routing.module';

import { SpeciesComponent } from './species.component';
import { SpecieComponent } from './specie/specie.component';

@NgModule({
  declarations: [
    SpeciesComponent,
    SpecieComponent
  ],
  imports: [
    CommonModule,
    ListModule,
    LoadingModule,
    SpeciesRoutingModule
  ]
})
export class SpeciesModule { }
