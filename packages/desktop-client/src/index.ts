import { app, BrowserWindow } from "electron";
import { client as WebsocketClient } from 'websocket';
import { Commands } from "smartphone-remote-shared";
import { SendKey, SendKeyCodes } from "./send-key";
import { v4 } from 'uuid';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

interface IConfig {
    pageUrl: string;
    wsUrl: string;
    sessionId?: string;
}

let config: IConfig = {
    pageUrl: "http://localhost:4200/desktop",
    wsUrl: "ws://localhost:8080/desktop",
}

function createWindow(sessionId: string) {
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        autoHideMenuBar: true,
        title: "smartphone-remote",
    });

    mainWindow.loadURL(`${config.pageUrl}/${sessionId}`);

}

function connect(session: string): Promise<void> {
    return new Promise((res, rej) => {

        const client = new WebsocketClient();
        const sendKey = new SendKey().init();

        client.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString());
            rej();
        });

        client.on('connect', function (connection) {
            console.log('WebSocket Client Connected');
            let isAlive = true
            connection.on('error', function (error) {
                console.log("Connection Error: " + error.toString());
                res();
            });
            connection.on('close', function () {
                console.log('echo-protocol Connection Closed');
                res();
            });
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    console.log("Received: '" + message.utf8Data + "'");
                    switch (message.utf8Data) {
                        case Commands.VOLUME_MUTE: sendKey.sendKey(SendKeyCodes.VK_VOLUME_MUTE); break;
                        case Commands.VOLUME_DOWN: sendKey.sendKey(SendKeyCodes.VK_VOLUME_DOWN); break;
                        case Commands.VOLUME_UP: sendKey.sendKey(SendKeyCodes.VK_VOLUME_UP); break;
                        case Commands.MEDIA_NEXT_TRACK: sendKey.sendKey(SendKeyCodes.VK_MEDIA_NEXT_TRACK); break;
                        case Commands.MEDIA_PREV_TRACK: sendKey.sendKey(SendKeyCodes.VK_MEDIA_PREV_TRACK); break;
                        case Commands.MEDIA_STOP: sendKey.sendKey(SendKeyCodes.VK_MEDIA_STOP); break;
                        case Commands.MEDIA_PLAY_PAUSE: sendKey.sendKey(SendKeyCodes.VK_MEDIA_PLAY_PAUSE); break;
                        case Commands.VK_ESCAPE: sendKey.sendKey(SendKeyCodes.VK_ESCAPE); break;
                        case Commands.VK_LEFT: sendKey.sendKey(SendKeyCodes.VK_LEFT); break;
                        case Commands.VK_UP: sendKey.sendKey(SendKeyCodes.VK_UP); break;
                        case Commands.VK_RIGHT: sendKey.sendKey(SendKeyCodes.VK_RIGHT); break;
                        case Commands.VK_DOWN: sendKey.sendKey(SendKeyCodes.VK_DOWN); break;
                        case Commands.VK_SPACE: sendKey.sendKey(SendKeyCodes.VK_SPACE); break;
                        case Commands.A: sendKey.sendKey(SendKeyCodes.A); break;
                        case Commands.B: sendKey.sendKey(SendKeyCodes.B); break;
                        case Commands.C: sendKey.sendKey(SendKeyCodes.C); break;
                        case Commands.D: sendKey.sendKey(SendKeyCodes.D); break;
                        case Commands.E: sendKey.sendKey(SendKeyCodes.E); break;
                        case Commands.F: sendKey.sendKey(SendKeyCodes.F); break;
                        case Commands.G: sendKey.sendKey(SendKeyCodes.G); break;
                        case Commands.H: sendKey.sendKey(SendKeyCodes.H); break;
                        case Commands.I: sendKey.sendKey(SendKeyCodes.I); break;
                        case Commands.J: sendKey.sendKey(SendKeyCodes.J); break;
                        case Commands.K: sendKey.sendKey(SendKeyCodes.K); break;
                        case Commands.L: sendKey.sendKey(SendKeyCodes.L); break;
                        case Commands.M: sendKey.sendKey(SendKeyCodes.M); break;
                        case Commands.N: sendKey.sendKey(SendKeyCodes.N); break;
                        case Commands.O: sendKey.sendKey(SendKeyCodes.O); break;
                        case Commands.P: sendKey.sendKey(SendKeyCodes.P); break;
                        case Commands.Q: sendKey.sendKey(SendKeyCodes.Q); break;
                        case Commands.R: sendKey.sendKey(SendKeyCodes.R); break;
                        case Commands.S: sendKey.sendKey(SendKeyCodes.S); break;
                        case Commands.T: sendKey.sendKey(SendKeyCodes.T); break;
                        case Commands.U: sendKey.sendKey(SendKeyCodes.U); break;
                        case Commands.V: sendKey.sendKey(SendKeyCodes.V); break;
                        case Commands.W: sendKey.sendKey(SendKeyCodes.W); break;
                        case Commands.X: sendKey.sendKey(SendKeyCodes.X); break;
                        case Commands.Y: sendKey.sendKey(SendKeyCodes.Y); break;
                        case Commands.Z: sendKey.sendKey(SendKeyCodes.Z); break;
                        case Commands.VK_F5: sendKey.sendKey(SendKeyCodes.VK_F5); break;
                        case Commands.VK_F11: sendKey.sendKey(SendKeyCodes.VK_F11); break;
                        case Commands.VK_OEM_COMMA: sendKey.sendKey(SendKeyCodes.VK_OEM_COMMA); break;
                        case Commands.VK_OEM_PERIOD: sendKey.sendKey(SendKeyCodes.VK_OEM_PERIOD); break;
                        case Commands.WINDOW_LEFT: sendKey.moveWindow(SendKeyCodes.VK_LEFT); break;
                        case Commands.WINDOW_UP: sendKey.moveWindow(SendKeyCodes.VK_UP); break;
                        case Commands.WINDOW_RIGHT: sendKey.moveWindow(SendKeyCodes.VK_RIGHT); break;
                        case Commands.WINDOW_DOWN: sendKey.moveWindow(SendKeyCodes.VK_DOWN); break;
                    }
                }
            });
            const keepaliveIntervall = setInterval(() => {
                if (isAlive) {
                    connection.sendUTF(Commands.KEEPALIVE);
                }
                else {
                    clearInterval(keepaliveIntervall);
                }
            }, 1000);

        });


        client.connect(`${config.wsUrl}/${session}`);
    });

}

const configFile = join(__dirname, "config.json");
function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command: string, args: string[]) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args: string[]) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            writeFileSync(configFile, JSON.stringify(<IConfig>{
                pageUrl: "https://remote.rudolph.pro/desktop",
                wsUrl: "wss://remote.rudolph.pro/api/desktop",
            }, undefined, 4));

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
            unlinkSync(configFile);
            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};

async function main(): Promise<void> {
    // this should be placed at top of main.js to handle setup events quickly
    if (handleSquirrelEvent()) {
        // squirrel event handled and app will exit in 1000ms, so don't do anything else
        return;
    }
    
    if(existsSync(configFile)) {
        config = JSON.parse(readFileSync(configFile).toString());
    }

    const sessionId = config.sessionId ?? v4();
    console.log(sessionId);
    app.on("ready", () => {
        createWindow(sessionId);

        app.on("activate", function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow(sessionId);
        });
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    for (; ;) {
        await connect(sessionId);
    }

}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
