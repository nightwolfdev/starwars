import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StarshipComponent } from './starship/starship.component';
import { StarshipsComponent } from './starships.component';

const routes: Routes = [
  {
    path: '',
    component: StarshipsComponent
  },
  {
    path: ':id',
    component: StarshipComponent,
    data: {
      pageTitle: 'View Starship'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StarshipsRoutingModule { }
