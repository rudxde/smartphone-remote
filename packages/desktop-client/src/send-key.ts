import { spawn } from 'child_process';
import { Writable } from 'stream';
import { join } from 'path'
export class SendKey {

    stdIn: Writable | undefined;

    init(): SendKey {
        const child = spawn(join(__dirname, "..", "windows-key-sender.exe"), {
            stdio: [
                "pipe", // Stdin,
                "inherit", //  Stdout,
                "inherit"//   Stderr
            ],
        });
        this.stdIn = child.stdin;
        return this;
    }

    sendKey(code: number): void {
        const mode = 1;
        this.stdIn?.write(Buffer.from([0, mode, code]));
    }
}

// https://docs.microsoft.com/de-de/windows/win32/inputdev/virtual-key-codes
export enum SendKeyCodes {
    VK_VOLUME_MUTE = 0xAD,
    VK_VOLUME_DOWN = 0xAE,
    VK_VOLUME_UP = 0xAF,
    VK_MEDIA_NEXT_TRACK = 0xB0,
    VK_MEDIA_PREV_TRACK = 0xB1,
    VK_MEDIA_STOP = 0xB2,
    VK_MEDIA_PLAY_PAUSE = 0xB3
}
