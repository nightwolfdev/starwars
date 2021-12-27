import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilmComponent } from './film/film.component';
import { FilmsComponent } from './films.component';

const routes: Routes = [
  {
    path: '',
    component: FilmsComponent
  },
  {
    path: ':id',
    component: FilmComponent,
    data: {
      pageTitle: 'View Film'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
