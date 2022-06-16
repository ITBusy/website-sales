import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cutChain'
})
export class CutChainPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let a = value.split(" ");
    let v = '';
    if (args == undefined) {
      let c: any = [];
      if (a.length > 5 && a.length <= 10) {
        for (let i = 0; i < 5; i++) {
          c.push(a[i]);
        }
        v = c.join(' ') + "..."
      } else if (a.length <= 5) {
        v = value;
      } else {
        let b = Math.floor(160 / a.length);
        let c: any = [];
        for (let i = 0; i < b; i++) {
          c.push(a[i]);
        }
        v = c.join(' ') + "...";
      }
    } else {
      let c: any = [];
      for (let i = 0; i < args; i++) {
        c.push(a[i]);
      }
      v = c.join(' ') + "..."
    }
    return v;
  }

}
