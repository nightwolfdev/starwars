import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Film, FilmsService } from '../films.service';
import { Character, CharactersService } from '../../characters/characters.service';
import { Planet, PlanetsService } from '../../planets/planets.service';
import { Specie, SpeciesService } from '../../species/species.service';
import { Starship, StarshipsService } from 'src/app/starships/starships.service';
import { Vehicle, VehiclesService } from '../../vehicles/vehicles.service';

interface FilmData extends Film {
  charactersData: Character[];
  planetsData: Planet[];
  speciesData: Specie[];
  starshipsData: Starship[];
  vehiclesData: Vehicle[];
}

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {
  film$: Observable<FilmData>;

  constructor(
    private charactersSvc: CharactersService,
    private filmsSvc: FilmsService,
    private planetsSvc: PlanetsService,
    private route: ActivatedRoute,
    private speciesSvc: SpeciesService,
    private starshipsSvc: StarshipsService,
    private vehiclesSvc: VehiclesService
  ) { }

  ngOnInit(): void {
    this.film$ = this.route
      .paramMap
      .pipe(
        tap(params => this.filmsSvc.changeFilm(+params.get('id'))),
        switchMap(() => combineLatest([
          this.filmsSvc.film$,
          this.charactersSvc.characters$,
          this.planetsSvc.planets$,
          this.speciesSvc.species$,
          this.starshipsSvc.starships$,
          this.vehiclesSvc.vehicles$
        ]).pipe(
          map(([film, characters, planets, species, starships, vehicles]) => {
            return {
              ...film,
              charactersData: characters.filter(character => film.characterIds.includes(character.id)),
              planetsData: planets.filter(planet => film.planetIds.includes(planet.id)),
              speciesData: species.filter(specie => film.speciesIds.includes(specie.id)),
              starshipsData: starships.filter(starship => film.starshipIds.includes(starship.id)),
              vehiclesData: vehicles.filter(vehicle => film.vehicleIds.includes(vehicle.id))
            };
          })
        ))
      );
  }
}
