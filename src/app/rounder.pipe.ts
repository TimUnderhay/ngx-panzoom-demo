import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rounder',
    standalone: true
})

export class RounderPipe implements PipeTransform {

  transform(value: number | null | string, digits = 0): string {
    return typeof(value) === 'number' ? (value as number).toFixed(digits) : value;
  }
}
