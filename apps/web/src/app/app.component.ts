import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from '@foretag/env/web';
import { Store } from '@ngxs/store';

@Component({
  selector: 'foretag-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store,
    private readonly title: Title,
  ) {}

  // From <https://toddmotto.com/dynamic-page-titles-angular-2-router-events>
  // @TODO: Add loader when navigating
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
    ).subscribe(({ title }) => this.setTitle(title));
  }

  private setTitle(title: string) {
    this.title.setTitle(`${environment.app.name} - ${title}`);
  }
}
