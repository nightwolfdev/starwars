import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { expand, map, reduce, shareReplay } from 'rxjs/operators';

import { getHost, getId } from '../shared/functions';

export interface Character {
  birth_year: string;
  eye_color: string;
  filmIds: number[];
  films: string[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  homeworldId: number;
  id: number;
  mass: string;
  name: string;
  skin_color: string;
  speciesIds: number[];
  species: string[];
  starshipIds: number[];
  starships: string[];
  url: string;
  vehicleIds: number[];
  vehicles: string[];
}

interface CharactersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private changeCharacterSubject = new BehaviorSubject<number>(null);
  private changeCharacterId$ = this.changeCharacterSubject.asObservable();

  private changeFilterSubject = new BehaviorSubject<string>(null);
  private changeFilter$ = this.changeFilterSubject.asObservable();

  characters$: Observable<Character[]> = this.getCharacters();
  character$: Observable<Character> = this.getCharacter();

  constructor(private http: HttpClient) { }

  private getCharacter(): Observable<Character> {
    return combineLatest([
      this.characters$,
      this.changeCharacterId$
    ]).pipe(
      map(([characters, id]) => characters.find(character => character.id === id)),
      shareReplay(1)
    );
  }

  private getCharacters(): Observable<Character[]> {
    return combineLatest([
      this.http.get<CharactersResponse>(`${getHost()}/people`).pipe(
        expand(response => response.next ? this.http.get<CharactersResponse>(response.next) : EMPTY),
        reduce((acc, current) => acc.concat(current.results), []),
        map(characters => this.mapCharacters(characters))
      ),
      this.changeFilter$
    ]).pipe(
      map(([characters, changeFilter]) => characters.filter(character => changeFilter ? character.name.toLowerCase().includes(changeFilter) : character)),
      shareReplay(1)
    );
  }

  private mapCharacters(characters: Character[]): Character[] {
    return characters.map(character => {
      character.filmIds = character.films.map(url => getId(url));
      character.homeworldId = getId(character.homeworld);
      character.id = getId(character.url);
      character.speciesIds = character.species.map(url => getId(url));
      character.starshipIds = character.starships.map(url => getId(url));
      character.vehicleIds = character.vehicles.map(url => getId(url));
      return character;
    }).sort(this.sortNames);
  }

  private sortNames(a: Character, b: Character): number {
    return a.name > b.name
      ? 1
      : a.name < b.name
      ? -1
      : 0;
  }

  changeCharacter(id: number): void {
    this.changeCharacterSubject.next(id);
  }

  changeFilter(text: string): void {
    this.changeFilterSubject.next(text.toLowerCase());
  }

  getCurrentFilter(): string {
    return this.changeFilterSubject.getValue();
  }
}
