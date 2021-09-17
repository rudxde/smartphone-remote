import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteService } from '../remote.service';
import { Commands } from "smartphone-remote-shared";
import { Location } from '@angular/common';

@Component({
  selector: 'app-netflix',
  templateUrl: './netflix.component.html',
  styleUrls: ['./netflix.component.scss']
})
export class NetflixComponent implements OnInit {

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
  fullscreen() {
    this.remoteService.post(Commands.F);
  }
  escape() {
    this.remoteService.post(Commands.VK_ESCAPE);
  }
  play() {
    this.remoteService.post(Commands.MEDIA_PLAY_PAUSE);
  }
  backw() {
    this.remoteService.post(Commands.VK_LEFT);
  }
  forw() {
    this.remoteService.post(Commands.VK_RIGHT);
  }
  volup() {
    this.remoteService.post(Commands.VOLUME_UP);
  }
  voldown() {
    this.remoteService.post(Commands.VOLUME_DOWN);
  }
  mute() {
    this.remoteService.post(Commands.VOLUME_MUTE);
  }
  skip() {
    this.remoteService.post(Commands.S);
  }
}
