import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'desktop', loadChildren: async () => (await import('../desktop/desktop.module')).DesktopModule },
      { path: 'remote', loadChildren: async () => (await import('../remote/remote.module')).RemoteModule },
    ]),
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
