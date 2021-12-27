import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Planet, PlanetsService } from '../planets.service';
import { Character, CharactersService } from '../../characters/characters.service';
import { Film, FilmsService } from '../../films/films.service';

interface PlanetData extends Planet {
  filmsData: Film[];
  residentsData: Character[];
}

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.scss']
})
export class PlanetComponent implements OnInit {
  planet$: Observable<PlanetData>;

  constructor(
    private charactersSvc: CharactersService,
    private filmsSvc: FilmsService,
    private planetsSvc: PlanetsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.planet$ = this.route
      .paramMap
      .pipe(
        tap(params => this.planetsSvc.changePlanet(+params.get('id'))),
        switchMap(() => combineLatest([
          this.planetsSvc.planet$,
          this.charactersSvc.characters$,
          this.filmsSvc.films$
        ]).pipe(
          map(([planet, characters, films]) => {
            return {
              ...planet,
              filmsData: films.filter(film => planet.filmIds.includes(film.id)),
              residentsData: characters.filter(character => planet.residentIds.includes(character.id))
            }
          })
        ))
      );
  }
}
