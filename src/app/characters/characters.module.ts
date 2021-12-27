import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from '../list/list.module';
import { LoadingModule } from '../loading/loading.module';
import { CharactersRoutingModule } from './characters-routing.module';

import { CharactersComponent } from './characters.component';
import { CharacterComponent } from './character/character.component';

@NgModule({
  declarations: [
    CharacterComponent,
    CharactersComponent
  ],
  imports: [
    CommonModule,
    CharactersRoutingModule,
    ListModule,
    LoadingModule
  ]
})
export class CharactersModule { }
