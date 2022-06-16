import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'chain'
})
export class CutChainPipe implements PipeTransform {

  transform(value: any, numberCut: number): unknown {
    let getValue = value.split(" ");
    return getValue.slice(0, numberCut).join(" ");
  }

}
