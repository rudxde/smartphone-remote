import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Commands } from 'smartphone-remote-shared';
import { RemoteService } from '../remote.service';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {

  constructor(
    private remoteService: RemoteService,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.remoteService.connect(params.id);
    });
  }
  back() {
    this.location.back()
  }

  winUp(): void {
    this.remoteService.post(Commands.WINDOW_UP)
  }
  winDown(): void {
    this.remoteService.post(Commands.WINDOW_DOWN)
  }
  winLeft(): void {
    this.remoteService.post(Commands.WINDOW_LEFT)
  }
  winRight(): void {
    this.remoteService.post(Commands.WINDOW_RIGHT)
  }
  reload(): void {
    this.remoteService.post(Commands.VK_F5)
  }
  f11(): void {
    this.remoteService.post(Commands.VK_F11)
  }
  esc(): void {
    this.remoteService.post(Commands.VK_ESCAPE)
  }
}
