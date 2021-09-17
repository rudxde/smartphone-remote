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
        case Commands.VK_ESCAPE:
        case Commands.VK_LEFT:
        case Commands.VK_UP:
        case Commands.VK_RIGHT:
        case Commands.VK_DOWN:
        case Commands.VK_SPACE:
        case Commands.WINDOW_LEFT:
        case Commands.WINDOW_UP:
        case Commands.WINDOW_RIGHT:
        case Commands.WINDOW_DOWN:
        case Commands.A:
        case Commands.B:
        case Commands.C:
        case Commands.D:
        case Commands.E:
        case Commands.F:
        case Commands.G:
        case Commands.H:
        case Commands.I:
        case Commands.J:
        case Commands.K:
        case Commands.L:
        case Commands.M:
        case Commands.N:
        case Commands.O:
        case Commands.P:
        case Commands.Q:
        case Commands.R:
        case Commands.S:
        case Commands.T:
        case Commands.U:
        case Commands.V:
        case Commands.W:
        case Commands.X:
        case Commands.Y:
        case Commands.Z:
        case Commands.VK_F5:
        case Commands.VK_F11:
        case Commands.VK_OEM_COMMA:
        case Commands.VK_OEM_PERIOD:
            return command;
        case Commands.PING:
        case "ping":
            return Commands.PING_BACK;
        case Commands.KEEPALIVE:
        default:
            return Commands.NOOP;
    }
}
