import { Commands } from "smartphone-remote-shared";

export function filterCommands(command: string): string {
    switch (command) {
        case Commands.MEDIA_NEXT_TRACK:
        case Commands.MEDIA_PLAY_PAUSE:
        case Commands.MEDIA_PREV_TRACK:
        case Commands.MEDIA_STOP:
        case Commands.VOLUME_DOWN:
        case Commands.VOLUME_MUTE:
        case Commands.VOLUME_UP:
            return command;
        case Commands.PING:
        case "ping":
            return Commands.PING_BACK;
        case Commands.KEEPALIVE:
        default:
            return Commands.NOOP;
    }
}
