import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datecustom'
})
export class DatecustomPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
