import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {turnoverInterface} from "../../../entity/entity";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  public monthArray: string[] = [];
  public turnoverArray: turnoverInterface[] = [];

  constructor(private _cartService: CartService) {
  }

  ngOnInit(): void {
    this.getYear();
    this.getMonth();
    this.getDataTurnover(this.month, this.year);
  }

  public getMonth() {
    let now;
    this.monthArray.length = 0;
    if (this.year != new Date().getFullYear()) {
      now = 12;
    } else {
      now = new Date().getMonth() + 1;
    }
    for (let i = 1; i <= now; i++) {
      this.monthArray.push(i.toString());
    }
  }

  public getYear(): string[] {
    let now = new Date().getFullYear();
    let years: string[] = [];
    for (let i = (now - 5); i <= now; i++) {
      years.push(i.toString())
    }
    return years;
  }

  currentYear($event: any) {
    this.getYear();
    this.getMonth();
    this.getDataTurnover(this.month, this.year)
  }

  public getDataTurnover(month: number, year: number) {
    this._cartService.turnoverOrder(month, year).subscribe(
      (result: turnoverInterface[]) => {
        this.turnoverArray = result;
      }, (err) => alert(err)
    );
  }

  currentMonth($event: Event) {
    this.getYear();
    this.getMonth();
    console.log(this.month)
    this.getDataTurnover(this.month, this.year)
  }
}
