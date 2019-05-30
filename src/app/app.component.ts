import { Component, OnInit, Renderer2, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
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
<div #gridElement class="lock-screen" id="gridElement">

  <div *ngIf="initialised" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;">
    <pan-zoom [config]="panzoomConfig">
      <div class="bg noselect items" style="position: relative;" [style.width.px]="2400">
        <tile *ngFor="let item of contentItems" [content]="item"></tile>
      </div>
    </pan-zoom>
  </div>

  <div class="noselect" style="position: absolute; top: 20px; height: 230px; left: 10px; padding: 5px; background-color: rgba(0,0,0,0.8); font-size: 12px; border-radius:10px; width: 200px;">

    <!-- top buttons -->
    <div style="position: absolute; top: 10px">
      <div style="position: absolute; left: 0px;" toggleFullscreen class="icon fa fa-desktop fa-2x fa-fw"></div>
      <div style="position: absolute; left: 40px;" (click)="resetView()" class="icon fa fa-home fa-2x fa-fw"></div>
      <div style="position: absolute; left: 80px;" (click)="zoomOut()" class="icon fa fa-search-minus fa-2x fa-fw"></div>
      <div style="position: absolute; left: 120px;" (click)="zoomIn()" class="icon fa fa-search-plus fa-2x fa-fw"></div>
      <div style="position: absolute; left: 160px;" (click)="panToPoint()" class="icon fa fa-bullseye fa-2x fa-fw"></div>
    </div>

    <!-- panDelta() buttons -->
    <div style="position: absolute; top: 60px; left: 30px;">
      <div style="position: absolute; left: 5px; top: 0; color: red; width: 100px;" (click)="panUp100()">100px</div>
      <div style="position: absolute; left: 80px; color: red; width: 100px;" (click)="panUp100()">panDelta()</div>

      <div style="position: absolute; left: 40px;" (click)="panUp100()" class="icon fa fa-arrow-up fa-2x fa-fw"></div>
      <div style="position: absolute; left: 40px; top: 40px" (click)="panDown100()" class="icon fa fa-arrow-down fa-2x fa-fw"></div>
      <div style="position: absolute; left: 0; top: 20px" (click)="panLeft100()" class="icon fa fa-arrow-left fa-2x fa-fw"></div>
      <div style="position: absolute; left: 80px; top: 20px" (click)="panRight100()" class="icon fa fa-arrow-right fa-2x fa-fw"></div>

    </div>

    <!-- panDeltaPercent() buttons -->
    <div style="position: absolute; top: 160px; left: 30px;">
      <div style="position: absolute; left: 15px; top: 0; color: red; width: 100px;" (click)="panUp100()">20%</div>
      <div style="position: absolute; left: 80px; color: red; width: 100px;" (click)="panUp100()">panDeltaPercent()</div>


      <div style="position: absolute; left: 40px;" (click)="panUpPercent()" class="icon fa fa-arrow-up fa-2x fa-fw"></div>
      <div style="position: absolute; left: 40px; top: 40px" (click)="panDownPercent()" class="icon fa fa-arrow-down fa-2x fa-fw"></div>
      <div style="position: absolute; left: 0; top: 20px" (click)="panLeftPercent()" class="icon fa fa-arrow-left fa-2x fa-fw"></div>
      <div style="position: absolute; left: 80px; top: 20px" (click)="panRightPercent()" class="icon fa fa-arrow-right fa-2x fa-fw"></div>

    </div>

  </div>

  <div *ngIf="panzoomModel" class="noselect" style="position: absolute; bottom: 10px; left: 10px; width: 200px; padding: 5px; background-color: rgba(255,255,255,0.9); font-size: 12px; border-radius:10px;">
    <span style="font-weight: bold;">PanZoomModel</span>
    <div>
      pan.x: {{panzoomModel.pan.x}}<br>
      pan.y: {{panzoomModel.pan.y}}<br>
      zoomLevel: {{panzoomModel.zoomLevel}}<br>
      isPanning: {{panzoomModel.isPanning}}<br>
      ---------------------------<br>
      calculated scale: {{scale}}
    </div>
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

  .lock-screen {
    height: 100%;
    overflow: hidden;
    width: 100%;
    position: fixed;
}
  `]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor( private el: ElementRef,
               private renderer: Renderer2,
               private changeDetector: ChangeDetectorRef ) { }

  @ViewChild('gridElement', { static: true }) private gridElement: ElementRef;

  public panzoomConfig: PanZoomConfig = new PanZoomConfig({
    zoomLevels: 10,
    scalePerZoomLevel: 2.0,
    zoomStepDuration: 0.2,
    freeMouseWheelFactor: 0.01,
    zoomToFitZoomLevelFactor: 0.9,
    dragMouseButton: 'left'
  });
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  public panzoomModel: PanZoomModel;
  private modelChangedSubscription: Subscription;
  public contentItems = contentItems;
  public canvasWidth = 2400;
  public initialZoomHeight: number = null; // set in resetZoomToFit()
  public initialZoomWidth = this.canvasWidth;
  public initialised = false;
  public scale = this.getCssScale(this.panzoomConfig.initialZoomLevel);
  private isMobile = false;



  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'background-color', 'black');
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    this.apiSubscription = this.panzoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
    this.modelChangedSubscription = this.panzoomConfig.modelChanged.subscribe( (model: PanZoomModel) => this.onModelChanged(model) );
    this.isMobile = this.isMobileDevice();
    if (this.isMobile) {
      this.contentItems = this.contentItems.slice(0, 13);
    }
  }



  ngAfterViewInit(): void {
    this.resetZoomToFit();
    this.initialised = true;
    this.changeDetector.detectChanges();
  }



  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }



  private isMobileDevice(): boolean {
    return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
  }



  onModelChanged(model: PanZoomModel): void {
    this.panzoomModel = JSON.parse(JSON.stringify(model));
    this.scale = this.getCssScale(this.panzoomModel.zoomLevel);
    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }



  private getCssScale(zoomLevel: any): number {
    // log.debug('PanZoomComponent: getCssScale()');
    return Math.pow(this.panzoomConfig.scalePerZoomLevel, zoomLevel - this.panzoomConfig.neutralZoomLevel);
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



  public panLeft100(): void {
    this.panZoomAPI.panDelta( { x: -100, y: 0 } );
  }



  public panRight100(): void {
    this.panZoomAPI.panDelta( { x: 100, y: 0 } );
  }



  public panUp100(): void {
    this.panZoomAPI.panDelta( { x: 0, y: -100 } );
  }



  public panDown100(): void {
    this.panZoomAPI.panDelta( { x: 0, y: 100 } );
  }



  public panLeftPercent(): void {
    this.panZoomAPI.panDeltaPercent( { x: -20, y: 0 } );
  }



  public panRightPercent(): void {
    this.panZoomAPI.panDeltaPercent( { x: 20, y: 0 } );
  }



  public panUpPercent(): void {
    this.panZoomAPI.panDeltaPercent( { x: 0, y: -20 } );
  }



  public panDownPercent(): void {
    this.panZoomAPI.panDeltaPercent( { x: 0, y: 20 } );
  }



  public panToPoint(): void {
    // this.panZoomAPI.panToPoint( { x: 0, y: 0 } );
    this.panZoomAPI.panToPoint( { x: 2400, y: 4270 } );
    // this.panZoomAPI.panToPoint( { x: 2400, y: 0 } );
    // this.panZoomAPI.panToPoint( { x: 0, y: 4270 } );
  }





}
