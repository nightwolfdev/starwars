import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Vehicle, VehiclesService } from './vehicles.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  vehicles$: Observable<Vehicle[]>;

  get currentFilter(): string {
    return this.vehiclesSvc.getCurrentFilter();
  }

  constructor(private vehiclesSvc: VehiclesService) { }

  ngOnInit(): void {
    this.vehicles$ = this.vehiclesSvc.vehicles$;
  }

  onInput(text: string): void {
    this.vehiclesSvc.changeFilter(text);
  }
}
