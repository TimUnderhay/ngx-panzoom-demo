  import { Component, OnInit, Renderer2, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PanZoomConfig, PanZoomAPI, PanZoomModel } from 'ng2-panzoom';
import { Content } from './content';
import { contentItems } from './contentItems';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<div #gridElement id="gridElement" style="position:absolute; left: 0; right: 0; bottom: 0; top: 0;">
  <h1>Demo of ng2-panzoom</h1>
  <!--<button type="button" (click)="zoomIn()">Zoom In</button> <button type="button" (click)="zoomOut()">Zoom Out</button>-->

  <div *ngIf="initialised" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;">
    <pan-zoom [config]="panzoomConfig">
      <div class="bg noselect items" style="position: relative;" [style.width.px]="2400">
        <tile *ngFor="let item of contentItems" [content]="item"></tile>
      </div>
    </pan-zoom>
  </div>

  <div class="noselect" style="position: absolute; top: 20px; left: 10px; padding: 5px; background-color: rgba(0,0,0,0.8); font-size: 12px; border-radius:10px;">
    <div style="position: absolute; left: 40px;" toggleFullscreen class="icon fa fa-desktop fa-2x fa-fw"></div>
    <div style="position: absolute; left: 80px;" (click)="resetView()" class="icon fa fa-home fa-2x fa-fw"></div>
    <div style="position: absolute; left: 120px;" (click)="zoomOut()" class="icon fa fa-search-minus fa-2x fa-fw"></div>
    <div style="position: absolute; left: 160px;" (click)="zoomIn()" class="icon fa fa-search-plus fa-2x fa-fw"></div>
  </div>

<div>
  `,
  styles: [`
  tile {
    display: inline-block;
  }

  .icon {
    background-color: rgb(75,173,243);
    color: white;
    border-radius: 10px;
    padding: 3px;
  }
  `]
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor( private el: ElementRef,
               private renderer: Renderer2,
               private changeDetector: ChangeDetectorRef ) { }

  @ViewChild('gridElement') private gridElement: ElementRef;

  public panzoomConfig: PanZoomConfig = new PanZoomConfig;
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  private panzoomModel: PanZoomModel;
  private transitionZoomLevel = 3.9;
  private previousFocusedElement: Node;
  public contentItems = contentItems;
  public canvasWidth = 2400;
  public initialZoomHeight: number = null; // set in resetZoomToFit()
  public initialZoomWidth = this.canvasWidth;
  public initialised = false;

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'background-color', 'black');
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    this.panzoomConfig.invertMouseWheel = true;
    this.panzoomConfig.useHardwareAcceleration = true;
    this.panzoomConfig.chromeUseTransform = true;
    this.panzoomConfig.zoomLevels = 10;
    this.panzoomConfig.scalePerZoomLevel = 2.0;
    this.panzoomConfig.zoomStepDuration = 0.2;
    this.panzoomConfig.freeMouseWheel = true;
    this.panzoomConfig.freeMouseWheelFactor = 0.01;
    this.panzoomConfig.zoomToFitZoomLevelFactor = 0.9;
    this.apiSubscription = this.panzoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
  }

  ngAfterViewInit(): void {
    this.resetZoomToFit();
    this.initialised = true;
    this.changeDetector.detectChanges();
  }

  resetZoomToFit(): void {
    let height = this.gridElement.nativeElement.clientHeight;
    let width = this.gridElement.nativeElement.clientWidth;
    height = this.canvasWidth * height / width;
    this.panzoomConfig.initialZoomToFit = { x: 0, y: 0, width: this.canvasWidth, height: height };
    this.initialZoomHeight = height;
  }

  public zoomIn(): void {
    this.panZoomAPI.zoomIn();
  }

  public zoomOut(): void {
    this.panZoomAPI.zoomOut();
  }

  public resetView(): void {
    this.panZoomAPI.resetView();
  }

}
