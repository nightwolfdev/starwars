import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Planet, PlanetsService } from './planets.service';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.scss']
})
export class PlanetsComponent implements OnInit {
  planets$: Observable<Planet[]>;

  get currentFilter(): string {
    return this.planetsSvc.getCurrentFilter();
  }

  constructor(private planetsSvc: PlanetsService) { }

  ngOnInit(): void {
    this.planets$ = this.planetsSvc.planets$;
  }

  onInput(text: string): void {
    this.planetsSvc.changeFilter(text);
  }
}
