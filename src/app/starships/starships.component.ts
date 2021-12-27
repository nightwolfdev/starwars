import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Starship, StarshipsService } from './starships.service';

@Component({
  selector: 'app-starships',
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.scss']
})
export class StarshipsComponent implements OnInit {
  starships$: Observable<Starship[]>;

  get currentFilter(): string {
    return this.starshipsSvc.getCurrentFilter();
  }

  constructor(private starshipsSvc: StarshipsService) { }

  ngOnInit(): void {
    this.starships$ = this.starshipsSvc.starships$;
  }

  onInput(text: string): void {
    this.starshipsSvc.changeFilter(text);
  }
}
