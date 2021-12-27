import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Starship, StarshipsService } from '../starships.service';
import { Character, CharactersService } from '../../characters/characters.service';
import { Film, FilmsService } from '../../films/films.service';

interface StarshipData extends Starship {
  filmsData: Film[];
  pilotsData: Character[];
}

@Component({
  selector: 'app-starship',
  templateUrl: './starship.component.html',
  styleUrls: ['./starship.component.scss']
})
export class StarshipComponent implements OnInit {
  starship$: Observable<StarshipData>;

  constructor(
    private charactersSvc: CharactersService,
    private filmsSvc: FilmsService,
    private route: ActivatedRoute,
    private starshipsSvc: StarshipsService
  ) { }

  ngOnInit(): void {
    this.starship$ = this.route
    .paramMap
    .pipe(
      tap(params => this.starshipsSvc.changeStarship(+params.get('id'))),
      switchMap(() => combineLatest([
        this.starshipsSvc.starship$,
        this.charactersSvc.characters$,
        this.filmsSvc.films$
      ]).pipe(
        map(([starship, characters, films]) => {
          return {
            ...starship,
            filmsData: films.filter(film => starship.filmIds.includes(film.id)),
            pilotsData: characters.filter(character => starship.pilotIds.includes(character.id))
          };
        })
      ))
    );
  }

}
