import { Component, OnInit, Renderer2, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PanZoomConfig, PanZoomAPI, PanZoomModel } from 'ng2-panzoom';
import { contentItems } from './contentItems';
import * as utils from './utils';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
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
    this.panzoomModel = utils.deepCopy(model);
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
