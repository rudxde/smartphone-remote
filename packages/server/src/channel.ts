import { env } from './env';
import { RedisAsyncClient } from './redis-async-client';

export class Channel {
    private static allChannels: Channel[] = [];

    private clients: ChannelClient[] = [];

    static redisSubscriber: RedisAsyncClient;
    static redisPublisher: RedisAsyncClient;

    constructor(
        private id: string,
    ) {

    }

    static async join(id: string, subscriber: (message: string) => void): Promise<ChannelClient> {
        if (!Channel.redisSubscriber) {
            Channel.redisSubscriber = RedisAsyncClient.createClient({ host: env.redis_url, port: env.redis_port });
            Channel.redisSubscriber.redisClient.on('message', (channel, message) => {
                console.debug(`redis-message: channel: ${channel}, message: ${message}`);
                Channel.allChannels.find(x => x.id === channel)?.redisMessage(message);
            });
            Channel.redisPublisher = Channel.redisSubscriber.duplicate();
        }
        let joiningChannel = this.allChannels.find(x => x.id === id);
        if (!joiningChannel) {
            joiningChannel = new Channel(id);
            await Channel.redisSubscriber.subscribe(id);
            Channel.allChannels.push(joiningChannel);
        }
        const client = new ChannelClient(subscriber, joiningChannel);
        joiningChannel.clients.push(client);
        return client;
    }

    static async leave(client: ChannelClient): Promise<void> {
        const leavingChannel = client.channel;
        leavingChannel.clients = client.channel.clients.filter(x => x !== client);
        if (leavingChannel.clients.length === 0) {
            await leavingChannel.destroy();
            this.allChannels = this.allChannels.filter(x => x !== leavingChannel);
        }
    }

    async write(message: string): Promise<void> {
        console.log("write:", message);
        await Channel.redisPublisher.publish(this.id, message);
    }

    private async destroy(): Promise<void> {
        await Channel.redisSubscriber.unsubscribe(this.id);
    }

    redisMessage(message: string): void {
        this.clients.forEach(x => x.subscriber(message));
    }

}

export class ChannelClient {
    constructor(
        public subscriber: (message: string) => void,
        public channel: Channel,
    ) { }
    async write(message: string): Promise<void> {
        await this.channel.write(message);
    }
    async leave(): Promise<void> {
        await Channel.leave(this);
    }
}
