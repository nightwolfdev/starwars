import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from '../list/list.module';
import { LoadingModule } from '../loading/loading.module';
import { FilmsRoutingModule } from './films-routing.module';

import { FilmsComponent } from './films.component';
import { FilmComponent } from './film/film.component';

@NgModule({
  declarations: [
    FilmsComponent,
    FilmComponent
  ],
  imports: [
    CommonModule,
    FilmsRoutingModule,
    ListModule,
    LoadingModule
  ]
})
export class FilmsModule { }
