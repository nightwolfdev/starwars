import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Character, CharactersService } from './characters.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characters$: Observable<Character[]>;

  get currentFilter(): string {
    return this.charactersSvc.getCurrentFilter();
  }

  constructor(private charactersSvc: CharactersService) { }

  ngOnInit(): void {
    this.characters$ = this.charactersSvc.characters$;
  }

  onInput(text: string): void {
    this.charactersSvc.changeFilter(text);
  }
}
