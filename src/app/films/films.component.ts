import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Film, FilmsService } from './films.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsComponent implements OnInit {
  films$: Observable<Film[]>;

  get currentFilter(): string {
    return this.filmsSvc.getCurrentFilter();
  }

  constructor(private filmsSvc: FilmsService) { }

  ngOnInit(): void {
    this.films$ = this.filmsSvc.films$;
  }

  onInput(text: string): void {
    this.filmsSvc.changeFilter(text);
  }
}
