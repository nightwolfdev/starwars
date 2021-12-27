import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Specie, SpeciesService } from '../species.service';
import { Character, CharactersService } from '../../characters/characters.service';
import { Film, FilmsService } from '../../films/films.service';
import { Planet, PlanetsService } from 'src/app/planets/planets.service';

interface SpecieData extends Specie {
  filmsData: Film[];
  homeworldData: Planet;
  peopleData: Character[];
}

@Component({
  selector: 'app-specie',
  templateUrl: './specie.component.html',
  styleUrls: ['./specie.component.scss']
})
export class SpecieComponent implements OnInit {
  specie$: Observable<SpecieData>;

  constructor(
    private charactersSvc: CharactersService,
    private filmsSvc: FilmsService,
    private planetsSvc: PlanetsService,
    private route: ActivatedRoute,
    private speciesSvc: SpeciesService
  ) { }

  ngOnInit(): void {
    this.specie$ = this.route
      .paramMap
      .pipe(
        tap(params => this.speciesSvc.changeSpecie(+params.get('id'))),
        switchMap(() => combineLatest([
          this.speciesSvc.specie$,
          this.charactersSvc.characters$,
          this.filmsSvc.films$,
          this.planetsSvc.planets$
        ]).pipe(
          map(([specie, characters, films, planets]) => {
            return {
              ...specie,
              filmsData: films.filter(film => specie.filmIds.includes(film.id)),
              peopleData: characters.filter(character => specie.peopleIds.includes(character.id)),
              homeworldData: planets.find(planet => specie.homeworldId === planet.id)
            }
          })
        ))
      );
  }
}
