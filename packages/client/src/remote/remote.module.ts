import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from './buttons/buttons.component';
import { OfflineComponent } from './offline/offline.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ButtonsComponent,
    OfflineComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':id', component: ButtonsComponent }
    ])
  ]
})
export class RemoteModule { }
