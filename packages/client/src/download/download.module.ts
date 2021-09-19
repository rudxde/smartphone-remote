import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download/download.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    DownloadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DownloadComponent }
    ]),
    MatButtonModule,
    MatIconModule,
  ]
})
export class DownloadModule { }
