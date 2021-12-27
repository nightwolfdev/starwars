import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from '../list/list.module';
import { LoadingModule } from '../loading/loading.module';
import { StarshipsRoutingModule } from './starships-routing.module';

import { StarshipsComponent } from './starships.component';
import { StarshipComponent } from './starship/starship.component';

@NgModule({
  declarations: [
    StarshipsComponent,
    StarshipComponent
  ],
  imports: [
    CommonModule,
    ListModule,
    LoadingModule,
    StarshipsRoutingModule
  ]
})
export class StarshipsModule { }
