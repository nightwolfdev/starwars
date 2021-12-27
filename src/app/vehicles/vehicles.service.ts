import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { expand, map, reduce, shareReplay } from 'rxjs/operators';

import { getHost, getId } from '../shared/functions';

export interface Vehicle {
  cargo_capacity: string;
  consumables: string;
  cost_in_credits: string;
  crew: string;
  filmIds: number[];
  films: string[];
  id: number;
  length: string;
  manufacturer: string;
  max_atmosphering_speed: string;
  model: string;
  name: string;
  passengers: string;
  pilotIds: number[];
  pilots: string[];
  url: string;
  vehicle_class: string;
}

interface VehiclesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Vehicle[];
}

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private changeVehicleSubject = new BehaviorSubject<number>(null);
  private changeVehicleId$ = this.changeVehicleSubject.asObservable();

  private changeFilterSubject = new BehaviorSubject<string>(null);
  private changeFilter$ = this.changeFilterSubject.asObservable();

  vehicles$: Observable<Vehicle[]> = this.getVehicles();
  vehicle$: Observable<Vehicle> = this.getVehicle();

  constructor(private http: HttpClient) { }

  private getVehicle(): Observable<Vehicle> {
    return combineLatest([
      this.vehicles$,
      this.changeVehicleId$
    ]).pipe(
      map(([vehicles, id]) => vehicles.find(vehicle => vehicle.id === id)),
      shareReplay(1)
    );
  }

  private getVehicles(): Observable<Vehicle[]> {
    return combineLatest([
      this.http.get<VehiclesResponse>(`${getHost()}/vehicles`).pipe(
        expand(response => response.next ? this.http.get<VehiclesResponse>(response.next) : EMPTY),
        reduce((acc, current) => acc.concat(current.results), []),
        map(vehicles => this.mapVehicles(vehicles))
      ),
      this.changeFilter$
    ]).pipe(
      map(([vehicles, changeFilter]) => vehicles.filter(vehicle => changeFilter ? vehicle.name.toLowerCase().includes(changeFilter) : vehicle)),
      shareReplay(1)
    );
  }

  private mapVehicles(vehicles: Vehicle[]): Vehicle[] {
    return vehicles.map(vehicle => {
      vehicle.pilotIds = vehicle.pilots.map(url => getId(url));
      vehicle.filmIds = vehicle.films.map(url => getId(url));
      vehicle.id = getId(vehicle.url);
      return vehicle;
    }).sort(this.sortNames);
  }

  private sortNames(a: Vehicle, b: Vehicle): number {
    return a.name > b.name
      ? 1
      : a.name < b.name
      ? -1
      : 0;
  }  

  changeVehicle(id: number): void {
    this.changeVehicleSubject.next(id);
  }

  changeFilter(text: string): void {
    this.changeFilterSubject.next(text.toLowerCase());
  }

  getCurrentFilter(): string {
    return this.changeFilterSubject.getValue();
  }
}
