import express, { Request, Response, NextFunction } from 'express';
import expressWs from 'express-ws';
import { Commands } from 'smartphone-remote-shared';
import { Channel, ChannelClient } from './channel';
import { env } from './env';
import { filterCommands } from './filter-commands';

const { app, getWss, applyTo } = expressWs(express());
app.use(express.json({ limit: "100mb" }));

app.get('/', (req, res) => {
    res.send("ok");
})

app.ws("/remote/:id", async (ws, req) => {
    console.log(`connect remote on channel ${req.params.id}`)
    const client = await Channel.join(req.params.id, (message) => { });
    ws.on('message', (data) => {
        const stringData = data.toString();
        const command = filterCommands(stringData);
        if (command === Commands.PING_BACK) {
            ws.send(Commands.PING_BACK)
        } else if (command !== Commands.NOOP) {
            client.write(command);
        }
    });
    ws.on('error', (error) => handleError(error, ws, client));
    ws.on('close', () => client!.leave().catch(err => { handleError(err, ws, client); }));
});

app.ws("/desktop/:id", async (ws, req) => {
    console.log(`connect desktop on channel ${req.params.id}`)
    const client = await Channel.join(req.params.id, (message) => {
        console.log(`Send ${message} to desktop client.`);
        ws.send(filterCommands(message));
    });
    ws.on('message', (data) => {
        const stringData = data.toString();
        const command = filterCommands(stringData);
        if (command === Commands.PING_BACK) {
            ws.send(Commands.PING_BACK)
        } else if (command !== Commands.NOOP) {
            client.write(command);
        }
    });
    ws.on('error', (error) => handleError(error, ws, client));
    ws.on('close', () => client!.leave().catch(err => { handleError(err, ws, client); }));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode) {
        const is400 = err.statusCode < 500 && err.statusCode >= 400;
        if (!is400) {
            console.error(err);
        }
        return res.sendStatus(err.statusCode);
    }
    console.error(err);
    res.sendStatus(500);
    next();
});


app.listen(env.port, () =>
    console.log(`Server listening on port ${env.port}!`),
);

function handleError(err: Error, ws: import('ws'), client: ChannelClient | undefined): void {
    console.error(err);
    if (client) {
        client.leave();
    }
    if (!ws.CLOSED && !ws.CLOSING) {
        ws.send('Error');
        ws.close();
    }
}
