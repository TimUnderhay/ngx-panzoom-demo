import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2PanZoomModule } from 'ng2-panzoom';
import { TileComponent } from './tile';
import { ToggleFullscreenDirective } from './fullscreen.directive';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    ToggleFullscreenDirective
  ],
  imports: [
    BrowserModule,
    Ng2PanZoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
