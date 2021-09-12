import { Component, OnInit } from '@angular/core';
import { RemoteService } from '../remote.service';
import { Commands } from "smartphone-remote-shared";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  constructor(
    private remoteService: RemoteService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.remoteService.connect(params.id);
    })
  }

  play() {
    this.remoteService.post(Commands.MEDIA_PLAY_PAUSE);
  }
  stop() {
    this.remoteService.post(Commands.MEDIA_STOP);
    
  }
  volup() {
    this.remoteService.post(Commands.VOLUME_UP);
    
  }
  voldown() {
    this.remoteService.post(Commands.VOLUME_DOWN);
  }
  track_next() {
    this.remoteService.post(Commands.MEDIA_NEXT_TRACK)
  }
  track_prev() {
    this.remoteService.post(Commands.MEDIA_PREV_TRACK)
  }
}
