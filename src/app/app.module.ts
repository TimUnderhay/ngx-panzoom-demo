import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TileComponent } from './tile';
import { ToggleFullscreenDirective } from './fullscreen.directive';
import { RounderPipe } from './rounder.pipe';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { AppComponent } from './app.component';

// Third-party modules
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    ToggleFullscreenDirective,
    RounderPipe
  ],
  imports: [
    BrowserModule,
    Ng2PanZoomModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
