import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { expand, map, reduce, shareReplay } from 'rxjs/operators';

import { getHost, getId } from '../shared/functions';

export interface Specie {
  average_height: string;
  average_lifespan: string;
  classification: string;
  designation: string;
  eye_colors: string;
  filmIds: number[];
  films: string[];
  hair_colors: string;
  homeworldId: number;
  homeworld: string;
  id: number;
  language: string;
  name: string;
  peopleIds: number[];
  people: string[];
  skin_colors: string;
  url: string;
}

interface SpeciesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Specie[];
}

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {
  private changeSpecieSubject = new BehaviorSubject<number>(null);
  private changeSpecieId$ = this.changeSpecieSubject.asObservable();

  private changeFilterSubject = new BehaviorSubject<string>(null);
  private changeFilter$ = this.changeFilterSubject.asObservable();

  species$: Observable<Specie[]> = this.getSpecies();
  specie$: Observable<Specie> = this.getSpecie();

  constructor(private http: HttpClient) { }

  private getSpecie(): Observable<Specie> {
    return combineLatest([
      this.species$,
      this.changeSpecieId$
    ]).pipe(
      map(([species, id]) => species.find(specie => specie.id === id)),
      shareReplay(1)
    );
  }

  private getSpecies(): Observable<Specie[]> {
    return combineLatest([
      this.http.get<SpeciesResponse>(`${getHost()}/species`).pipe(
        expand(response => response.next ? this.http.get<SpeciesResponse>(response.next) : EMPTY),
        reduce((acc, current) => acc.concat(current.results), []),
        map(species => this.mapSpecies(species))
      ),
      this.changeFilter$
    ]).pipe(
      map(([species, changeFilter]) => species.filter(specie => changeFilter ? specie.name.toLowerCase().includes(changeFilter) : specie)),
      shareReplay(1)
    );
  }

  private mapSpecies(species: Specie[]): Specie[] {
    return species.map(specie => {
      specie.filmIds = specie.films.map(url => getId(url));
      specie.homeworldId = getId(specie.homeworld);
      specie.id = getId(specie.url);
      specie.peopleIds = specie.people.map(url => getId(url));
      return specie;
    }).sort(this.sortNames);
  }

  private sortNames(a: Specie, b: Specie): number {
    return a.name > b.name
      ? 1
      : a.name < b.name
      ? -1
      : 0;
  }

  changeSpecie(id: number): void {
    this.changeSpecieSubject.next(id);
  }

  changeFilter(text: string): void {
    this.changeFilterSubject.next(text.toLowerCase());
  }

  getCurrentFilter(): string {
    return this.changeFilterSubject.getValue();
  }
}
