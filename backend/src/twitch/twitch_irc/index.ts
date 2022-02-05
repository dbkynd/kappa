import { Client } from 'tmi.js';
import events from '../../events';
import logger from '../../logger';
import messageHandler from './message_handler';

const channel = 'dbkynd'; // todo

// https://tmijs.com/

const client = new Client({
  channels: [channel],
  options: {
    skipMembership: true,
    skipUpdatingEmotesets: true,
  },
});

export function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    client.connect().catch(reject);
    client.once('connected', () => {
      logger.info(`Connected to Twitch IRC as ${client.getUsername()}`);
      resolve();
    });
  });
}

export function disconnect(): Promise<void> {
  return new Promise((resolve, reject) => {
    client
      .disconnect()
      .then(() => {
        logger.info('Disconnected from Twitch IRC');
        resolve();
      })
      .catch(reject);
  });
}

client.once('connected', () => {
  events.status.update({ twitchTmi: true });
});

client.on('disconnected', () => {
  events.status.update({ twitchTmi: false });
});

// https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md

// Username has cheered to a channel.
client.on('cheer', (_channel, userstate, message) => {
  events.cheer(userstate, message);
});

// Channel is now hosted by another broadcaster.
client.on('hosted', (_channel, username, viewers, autohost) => {
  events
    .hosted({
      username,
      viewers,
      autohost,
      raid: false,
    })
    .catch();
});

client.on('message', (_channel, userstate, message, self) => {
  messageHandler(userstate, message);
});

// Channel is now being raided by another broadcaster.
client.on('raided', (_channel, username, viewers) => {
  events
    .hosted({
      username,
      viewers,
      autohost: false,
      raid: true,
    })
    .catch();
});

// Username has resubbed on a channel.
client.on(
  'resub',
  (_channel, _username, _months, message, userstate, methods) => {
    events.subscription.resub(userstate, message);
  },
);

// The current state of the channel.
client.on('roomstate', (_channel, state) => {
  events.status.roomstate(state);
});

// Username gifted a subscription to recipient in a channel.
client.on(
  'subgift',
  (_channel, _username, _streakMonths, _recipient, _methods, userstate) => {
    events.subscription.subgift(userstate);
  },
);

// Username is gifting a subscription to someone in a channel.
client.on(
  'submysterygift',
  (_channel, _username, _numbOfSubs, _methods, userstate) => {
    events.subscription.submysterygift(userstate);
  },
);

// Username has subscribed to a channel.
client.on(
  'subscription',
  (_channel, _username, _method, _message, userstate) => {
    events.subscription.newSub(userstate);
  },
);

// https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Commands.md

export function deleteMessage(messageUUID: string): void {
  client.deletemessage(channel, messageUUID).catch();
}