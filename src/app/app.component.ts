import { Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions, Rect } from 'ngx-panzoom';
import { contentItems } from './contentItems';
import * as utils from './utils';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent implements AfterViewInit, OnDestroy {

  constructor(
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  private panZoomConfigOptions: PanZoomConfigOptions = {
    zoomLevels: 10,
    scalePerZoomLevel: 2.0,
    zoomStepDuration: 0.2,
    freeMouseWheelFactor: 0.01,
    zoomToFitZoomLevelFactor: 0.9,
    dragMouseButton: 'left'
  };
  panzoomConfig: PanZoomConfig;
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  panzoomModel: PanZoomModel;
  private modelChangedSubscription: Subscription;
  contentItems = contentItems;
  canvasWidth = 2400;
  initialZoomHeight: number; // set in resetZoomToFit()
  initialZoomWidth = this.canvasWidth;
  scale: number;



  ngAfterViewInit(): void {
    this.panzoomConfig = this.initPanzoomConfig();
    this.initialZoomHeight = this.panzoomConfig.initialZoomToFit.height;
    this.scale = this.getCssScale(this.panzoomConfig.initialZoomLevel)
    this.changeDetector.detectChanges();

    this.apiSubscription = this.panzoomConfig.api.subscribe(
      (api: PanZoomAPI) => this.panZoomAPI = api
    );
    this.modelChangedSubscription = this.panzoomConfig.modelChanged.subscribe(
      (model: PanZoomModel) => this.onModelChanged(model)
    );
  }



  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }



  private initPanzoomConfig(): PanZoomConfig {
    return {
      ...new PanZoomConfig(this.panZoomConfigOptions),
      initialZoomToFit: this.getInitialZoomToFit()
    };
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



  getInitialZoomToFit(): Rect {
    const width = this.el.nativeElement.clientWidth;
    const height = this.canvasWidth * this.el.nativeElement.clientHeight / width;
    return {
      x: 0,
      y: 0,
      width: this.canvasWidth,
      height
    };
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
