import { Injectable } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { catchError, switchMap, take, takeUntil } from 'rxjs/operators';
import { Commands } from 'smartphone-remote-shared';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {


  private connected$: Subject<boolean> = new Subject();
  private disconnect$: Subject<void> = new Subject();
  private webSocketIn$: Subject<string> = new Subject();
  private webSocketOut$: Subject<string> = new Subject();
  constructor() { 
  }


  connect(id: string) {
    this.createConnection(id).pipe(
      catchError((err, caught) => {
        console.error(err);
        return interval(1000).pipe(take(1), switchMap(() => caught))
      }),
      takeUntil(this.disconnect$)
    ).subscribe();
    // this.webSocketIn$
    //   .pipe(takeUntil(this.disconnect$))
    //   .subscribe({
    //     next: x => {
    //       const command = JSON.parse(x);
    //       if (!isCommand(command)) {
    //         console.error(`unexpected message: ${x}`);
    //         return;
    //       }
    //       switch (command.command) {
    //         case 'state':
    //           this.state$.next(command.state);
    //           break;
    //         case 'members':
    //           this.memberCount$.next(command.members);
    //           break;
    //         default:
    //           console.warn(`unknown command: ${x}`);
    //       }
    //     }
    //   });
    this.connected$.next(true);
  }

  disconnect() {
    this.disconnect$.next();
    this.connected$.next(false);
  }

  post(message: string) {
    this.webSocketOut$.next(message);
  }

  private endpoint(id: string): string {
    // return protocol + window.location.hostname + '/api/' + id;
    return environment.endpoint + '/remote/' + id;
  }

  private createConnection(id: string): Observable<string> {
    console.debug('creating new Websocket connection');
    const closeConnection = new Subject<void>();
    return new Observable(observer => {
      const websocket = new WebSocket(this.endpoint(id));
      this.webSocketOut$.pipe(takeUntil(closeConnection)).subscribe({
        next: (x) => {
          console.debug(`send message: ${x}`);
          if (websocket.readyState > 1) {
            console.debug(`websocket is already closed :/`);
            observer.error(new Error("websocket CLOSED or CLOSING"));
            // this.webSocketOut$.next(x);
            return;
          }
          websocket.send(x);
        }
      });
      websocket.onopen = () => {
        interval(1000)
          .pipe(takeUntil(closeConnection))
          .subscribe({ next: () => websocket.send(Commands.KEEPALIVE) })
      }
      websocket.onmessage = (event) => {
        console.debug(`got message from websocket: ${event.data}`);
        this.webSocketIn$.next(event.data);
      };
      websocket.onclose = () => observer.complete();
      websocket.onerror = (event) => observer.error(event);
      return (() => {
        console.debug(`Teardown Websocket`)
        closeConnection.next();
        closeConnection.complete();
        if (websocket.readyState < 2) {
          websocket.close();
        }
      });
    });
  }

}
