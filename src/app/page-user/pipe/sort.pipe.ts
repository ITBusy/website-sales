import {Pipe, PipeTransform} from '@angular/core';
import {CommentDtoInterface} from "../../entity/entity";

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: CommentDtoInterface[], ...args: any[]): CommentDtoInterface[] {
    return value.sort((a, b) => {
      return <any>new Date(a.commentDate) - <any>new Date(b.commentDate);
    }).reverse();
  }

}
