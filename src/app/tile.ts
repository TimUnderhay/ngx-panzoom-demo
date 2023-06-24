import { Component, Input } from '@angular/core';
import { Content } from './content';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tile',
    template: `
<div class="thumbnail-container">

  <div>
    <img [src]="'assets/' + content.thumbnail" class="thumbnail" [attr.tileId]="content.id">
  </div>

</div>
  `,
    styles: [`
    .thumbnail-container {
      position:relative;
      margin: 2px 10px 0 0;
      width: 116px;
      height: 116px;
      cursor: pointer;
      overflow:hidden;
      text-align:center;
      line-height:110px;
    }

    .thumbnail {
      max-width: 110px;
      max-height: 110px;
      vertical-align: middle;
    }
  `],
    standalone: true
})

export class TileComponent {

  @Input() content: Content;
  public showHighRes = false;

}
