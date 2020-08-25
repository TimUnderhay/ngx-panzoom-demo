import { Component, OnInit, Renderer2, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions } from 'ngx-panzoom';
import { contentItems } from './contentItems';
import * as utils from './utils';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor( private el: ElementRef,
               private renderer: Renderer2,
               private changeDetector: ChangeDetectorRef ) { }

  @ViewChild('gridElement', { static: true }) private gridElement: ElementRef;

  private panZoomConfigOptions: PanZoomConfigOptions = {
    zoomLevels: 10,
    scalePerZoomLevel: 2.0,
    zoomStepDuration: 0.2,
    freeMouseWheelFactor: 0.01,
    zoomToFitZoomLevelFactor: 0.9,
    dragMouseButton: 'left'
  };
  panzoomConfig: PanZoomConfig = new PanZoomConfig(this.panZoomConfigOptions);
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  panzoomModel: PanZoomModel;
  private modelChangedSubscription: Subscription;
  contentItems = contentItems;
  canvasWidth = 2400;
  initialZoomHeight: number = null; // set in resetZoomToFit()
  initialZoomWidth = this.canvasWidth;
  initialised = false;
  scale = this.getCssScale(this.panzoomConfig.initialZoomLevel);
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
    return Math.pow(this.panzoomConfig.scalePerZoomLevel, zoomLevel - this.panzoomConfig.neutralZoomLevel);
  }



  resetZoomToFit(): void {
    let height = this.gridElement.nativeElement.clientHeight;
    const width = this.gridElement.nativeElement.clientWidth;
    height = this.canvasWidth * height / width;
    this.panzoomConfig.initialZoomToFit = {
      x: 0,
      y: 0,
      width: this.canvasWidth,
      height
    };
    this.initialZoomHeight = height;
  }



  onZoomInClicked(): void {
    this.panZoomAPI.zoomIn('viewCenter');
  }



  onZoomOutClicked(): void {
    this.panZoomAPI.zoomOut('viewCenter');
  }



  onResetViewClicked(): void {
    this.panZoomAPI.resetView();
  }



  onPanLeft100Clicked(): void {
    this.panZoomAPI.panDelta( { x: -100, y: 0 } );
  }



  onPanRight100Clicked(): void {
    this.panZoomAPI.panDelta( { x: 100, y: 0 } );
  }



  onPanUp100Clicked(): void {
    this.panZoomAPI.panDelta( { x: 0, y: -100 } );
  }



  onPanDown100Clicked(): void {
    this.panZoomAPI.panDelta( { x: 0, y: 100 } );
  }



  onPanLeftPercentClicked(): void {
    this.panZoomAPI.panDeltaPercent( { x: -20, y: 0 } );
  }



  onPanRightPercentClicked(): void {
    this.panZoomAPI.panDeltaPercent( { x: 20, y: 0 } );
  }



  onPanUpPercentClicked(): void {
    this.panZoomAPI.panDeltaPercent( { x: 0, y: -20 } );
  }



  onPanDownPercentClicked(): void {
    this.panZoomAPI.panDeltaPercent( { x: 0, y: 20 } );
  }



  onPanToPointClicked(): void {
    this.panZoomAPI.panToPoint( { x: 2400, y: 4270 } );
  }


  onCenterContentClicked(): void {
    this.panZoomAPI.centerContent();
  }



  onCenterXClicked(): void {
    this.panZoomAPI.centerX();
  }



  onCenterYClicked(): void {
    this.panZoomAPI.centerY();
  }



  onCenterTopLeftClicked(): void {
    this.panZoomAPI.centerTopLeft();
  }



  onCenterBottomLeftClicked(): void {
    this.panZoomAPI.centerBottomLeft();
  }



  onCenterTopRightClicked(): void {
    this.panZoomAPI.centerTopRight();
  }



  onCenterBottomRightClicked(): void {
    this.panZoomAPI.centerBottomRight();
  }

}
