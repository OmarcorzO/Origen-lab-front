import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'need'
})
export class NeedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
