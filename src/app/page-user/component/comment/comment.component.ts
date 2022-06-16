import {Component, OnInit} from '@angular/core';
import {CommentService} from 'src/app/services/comment.service';
import {ActivatedRoute} from "@angular/router";
import {CommentDtoInterface, CommentInterface} from "../../../entity/entity";
import {LoginService} from 'src/app/services/login.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  public commentList: CommentDtoInterface[] = [];
  public now: Date = new Date();
  public page: number = 1;

  constructor(private _commentService: CommentService,
              private _activatedRoute: ActivatedRoute,
              private _loginService: LoginService) {
  }

  ngOnInit(): void {
    this.findAllComments();
    setInterval(() => {
      this.findAllComments()
    }, 60000)
  }

  public createComment(event: any): void {
    let input = event.path[1].children[1];
    let coid = input.getAttribute("coid");
    if (coid == null) {
      this._commentService.createComment(this.getDataComment(input.value)).subscribe(() => {
        this.findAllComments();
      });
    }
  }

  public findAllComments(): void {
    let pid = this._activatedRoute.snapshot.queryParams['productID'];
    this._commentService.findAllComments(pid).subscribe(
      (result: CommentDtoInterface[]) => {
        this.commentList = result;
      }
    );
  }

  public getDataComment(value: string): CommentInterface {
    let pid = this._activatedRoute.snapshot.queryParams['productID'];
    return {
      commentId: 0,
      content: value,
      commentDate: new Date(),
      user: this._loginService.getUser(),
      product: {
        pid: pid
      }
    }
  }

  public getTimeComment(dateStr: string) {
    let date = new Date(dateStr)
    let time_comment;
    let now = new Date();
    let time = now.getTime() - date.getTime();
    let cal = time / 60;
    if (cal > 60 * 1000) {
      let hour = Math.floor(cal / (60 * 1000));
      if (hour > 24) {
        let days = Math.floor(hour / 24);
        let lastDaysMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        if (days > lastDaysMonth) {
          let daysOfYear = ((now.getFullYear() % 4 === 0 && now.getFullYear() % 100 > 0) || now.getFullYear() % 400 == 0) ? 366 : 365;
          if (days > daysOfYear) {
            time_comment = Math.floor((days / daysOfYear)) + " ago"
          } else {
            time_comment = Math.floor((days / lastDaysMonth)) + " ago"
          }
        } else {
          time_comment = days + " ago"
        }
      } else {
        time_comment = hour + "h ago";
      }
    } else {
      let m = cal / 1000;
      time_comment = Math.floor(m) + "m ago"
    }
    return time_comment;
  }

  openReply($event: MouseEvent) {
    console.log($event)
  }
}
