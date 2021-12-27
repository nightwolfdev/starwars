import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { expand, map, reduce, shareReplay } from 'rxjs/operators';

import { getHost, getId } from '../shared/functions';

export interface Film {
  characterIds: number[];
  characters: string[];
  director: string;
  episode_id: string;
  id: number;
  opening_crawl: string;
  planetIds: number[];
  planets: string[];
  producer: string;
  title: string;
  release_date: string;
  speciesIds: number[];
  species: string[];
  starshipIds: number[];
  starships: string[];
  url: string;
  vehicleIds: number[];
  vehicles: string[];
}

interface FilmsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Film[];
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  private changeFilmSubject = new BehaviorSubject<number>(null);
  private changeFilmId$ = this.changeFilmSubject.asObservable();

  private changeFilterSubject = new BehaviorSubject<string>(null);
  private changeFilter$ = this.changeFilterSubject.asObservable();  

  films$: Observable<Film[]> = this.getFilms();
  film$: Observable<Film> = this.getFilm();

  constructor(private http: HttpClient) { }

  private getFilm(): Observable<Film> {
    return combineLatest([
      this.films$,
      this.changeFilmId$
    ]).pipe(
      map(([films, id]) => films.find(film => film.id === id)),
      shareReplay(1)
    );
  }

  private getFilms(): Observable<Film[]> {
    return combineLatest([
      this.http.get<FilmsResponse>(`${getHost()}/films`).pipe(
        expand(response => response.next ? this.http.get<FilmsResponse>(response.next) : EMPTY),
        reduce((acc, current) => acc.concat(current.results), []),
        map(films => this.mapFilms(films))
      ),
      this.changeFilter$
    ]).pipe(
      map(([films, changeFilter]) => films.filter(film => changeFilter ? film.title.toLowerCase().includes(changeFilter) : film)),
      shareReplay(1)
    );
  }

  private mapFilms(films: Film[]): Film[] {
    return films.map(film => {
      film.characterIds = film.characters.map(url => getId(url));
      film.id = getId(film.url);
      film.planetIds = film.planets.map(url => getId(url));
      film.speciesIds = film.species.map(url => getId(url));
      film.starshipIds = film.starships.map(url => getId(url));
      film.vehicleIds = film.vehicles.map(url => getId(url));
      return film;
    }).sort(this.sortEpisodes);
  }

  private sortEpisodes(a: Film, b: Film): number {
    return a.episode_id > b.episode_id
      ? 1
      : a.episode_id < b.episode_id
      ? -1
      : 0;
  }  

  changeFilm(id: number): void {
    this.changeFilmSubject.next(id);
  }

  changeFilter(text: string): void {
    this.changeFilterSubject.next(text.toLowerCase());
  }

  getCurrentFilter(): string {
    return this.changeFilterSubject.getValue();
  }
}
