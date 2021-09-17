import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from './buttons/buttons.component';
import { OfflineComponent } from './offline/offline.component';
import { RouterModule } from '@angular/router';
import { NetflixComponent } from './netflix/netflix.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    ButtonsComponent,
    OfflineComponent,
    NetflixComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule.forChild([
      { path: ':id', component: ButtonsComponent },
      { path: ':id/netflix', component: NetflixComponent },
    ])
  ]
})
export class RemoteModule { }
