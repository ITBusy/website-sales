import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent implements OnInit {

  @Output() onScrollTop: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onScroll() {
    this.onScrollTop.emit();
  }
}
