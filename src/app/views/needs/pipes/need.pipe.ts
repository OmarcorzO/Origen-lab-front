import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'needName'
})
export class NeedPipe implements PipeTransform {

  transform(id: string, ...array: any[]): unknown {
    const name: any = array[0].find((m: any) => m._id == id);
    if (name == undefined) {
      return 'Cargando...';
    } else {
      return name.title;
    }
  }

}
