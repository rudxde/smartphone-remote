import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as qrcode from "qrcode-generator";

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    const ctx = this.canvas!.nativeElement.getContext('2d')!;
    this.route.params.subscribe(params => {
      const scale = 50;
      const versionNumber = 5;
      const size = 4 * versionNumber + 17;
      const qr = qrcode(versionNumber, "L");
      qr.addData(`https://remote.rudolph.pro/remote/${params.id}`)
      qr.make();
      this.canvas!.nativeElement.width = size * scale;
      this.canvas!.nativeElement.height = size * scale;
      qr.renderTo2dContext(ctx, scale);
    });
  }

}
