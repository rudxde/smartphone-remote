import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from './buttons/buttons.component';
import { OfflineComponent } from './offline/offline.component';
import { RouterModule } from '@angular/router';
import { NetflixComponent } from './netflix/netflix.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserComponent } from './browser/browser.component';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  declarations: [
    ButtonsComponent,
    OfflineComponent,
    NetflixComponent,
    BrowserComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule.forChild([
      { path: ':id', component: OverviewComponent },
      { path: ':id/old', component: ButtonsComponent },
      { path: ':id/browser', component: BrowserComponent },
      { path: ':id/netflix', component: NetflixComponent },
    ])
  ]
})
export class RemoteModule { }
