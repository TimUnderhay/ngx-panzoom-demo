import { Directive, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';
declare var log;


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[toggleFullscreen]'
})
export class ToggleFullscreenDirective {

  @HostListener('click') onClick() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
}
