import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setPageTitle();
  }

  private setPageTitle(): void {
    const defaultPageTitle = 'Star Wars';

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;

        if (!child) {
          return this.activatedRoute.snapshot.data['pageTitle'] || defaultPageTitle;
        }

        while (child.firstChild) {
          child = child.firstChild;
        }

        if (child.snapshot.data['pageTitle']) {
          return child.snapshot.data['pageTitle'] || defaultPageTitle;
        }
      })
    ).subscribe((title: string) => this.title.setTitle(title));
  }
}
