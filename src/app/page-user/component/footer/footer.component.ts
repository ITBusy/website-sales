import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT, ViewportScroller} from "@angular/common";
import {fromEvent, map, Observable} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  readonly showScroll: Observable<boolean> = fromEvent(
    this.document,
    'scroll'
  ).pipe(
    untilDestroyed(this),
    map(() => this.viewport.getScrollPosition()?.[1] > 300)
  )

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              private readonly viewport: ViewportScroller) {
  }

  ngOnInit(): void {
  }

  onScrollTop() {
    this.viewport.scrollToPosition([0, 0]);
  }
}
