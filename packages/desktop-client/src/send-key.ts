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

    moveWindow(directionCode: number): void {
        const modePress = 1;
        const modeDown = 2;
        const modeUp = 3;
        this.stdIn?.write(Buffer.from([
            0, modeDown, SendKeyCodes.VK_LWIN,
            0, modePress, directionCode,
            0, modeUp, SendKeyCodes.VK_LWIN
        ]));
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
    VK_MEDIA_PLAY_PAUSE = 0xB3,
    VK_ESCAPE = 0x1B,
    VK_LWIN = 0x5B,
    VK_LEFT = 0x25,
    VK_UP = 0x26,
    VK_RIGHT = 0x27,
    VK_DOWN = 0x28,
    VK_SPACE = 0x20,
    A = 0x41,
    B = 0x42,
    C = 0x43,
    D = 0x44,
    E = 0x45,
    F = 0x46,
    G = 0x47,
    H = 0x48,
    I = 0x49,
    J = 0x4A,
    K = 0x4B,
    L = 0x4C,
    M = 0x4D,
    N = 0x4E,
    O = 0x4F,
    P = 0x50,
    Q = 0x51,
    R = 0x52,
    S = 0x53,
    T = 0x54,
    U = 0x55,
    V = 0x56,
    W = 0x57,
    X = 0x58,
    Y = 0x59,
    Z = 0x5A,
    VK_F5 = 0x74,
    VK_F11 = 0x7A,
    VK_OEM_COMMA = 0xBC,
    VK_OEM_PERIOD = 0xBE,
}
