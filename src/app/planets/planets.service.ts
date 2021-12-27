import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { expand, map, reduce, shareReplay } from 'rxjs/operators';

import { getHost, getId } from '../shared/functions';

export interface Planet {
  climate: string;
  diameter: string;
  filmIds: number[];
  films: string[];
  gravity: string;
  id: number;
  name: string;
  orbital_period: string;
  population: string;
  residentIds: number[];
  residents: string[];
  rotation_period: string;
  surface_water: string;
  terrain: string;
  url: string;
}

interface PlanetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planet[];
}

@Injectable({
  providedIn: 'root'
})
export class PlanetsService {
  private changePlanetSubject = new BehaviorSubject<number>(null);
  private changePlanetId$ = this.changePlanetSubject.asObservable();

  private changeFilterSubject = new BehaviorSubject<string>(null);
  private changeFilter$ = this.changeFilterSubject.asObservable();  

  planets$: Observable<Planet[]> = this.getPlanets();
  planet$: Observable<Planet> = this.getPlanet();

  constructor(private http: HttpClient) { }

  private getPlanet(): Observable<Planet> {
    return combineLatest([
      this.planets$,
      this.changePlanetId$
    ]).pipe(
      map(([planets, id]) => planets.find(planet => planet.id === id)),
      shareReplay(1)
    );
  }

  private getPlanets(): Observable<Planet[]> {
    return combineLatest([
      this.http.get<PlanetsResponse>(`${getHost()}/planets`).pipe(
        expand(response => response.next ? this.http.get<PlanetsResponse>(response.next) : EMPTY),
        reduce((acc, current) => acc.concat(current.results), []),
        map(planets => this.mapPlanets(planets))
      ),
      this.changeFilter$
    ]).pipe(
      map(([planets, changeFilter]) => planets.filter(planet => changeFilter ? planet.name.toLowerCase().includes(changeFilter) : planet)),
      shareReplay(1)
    );
  }

  private mapPlanets(planets: Planet[]): Planet[] {
    return planets.map(planet => {
      planet.filmIds = planet.films.map(url => getId(url));
      planet.id = getId(planet.url);
      planet.residentIds = planet.residents.map(url => getId(url));
      return planet;
    }).sort(this.sortNames);
  }

  private sortNames(a: Planet, b: Planet): number {
    return a.name > b.name
      ? 1
      : a.name < b.name
      ? -1
      : 0;
  }

  changePlanet(id: number): void {
    this.changePlanetSubject.next(id);
  }

  changeFilter(text: string): void {
    this.changeFilterSubject.next(text.toLowerCase());
  }

  getCurrentFilter(): string {
    return this.changeFilterSubject.getValue();
  }
}
