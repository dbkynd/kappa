import HostService from '../database/lib/host';
import logger from '../logger';
import * as io from '../server/socket.io';
import twitchCache from '../twitch/cache';
import twitchApi from '../twitch/twitch_api';

export default async (payload: HostPayload): Promise<void> => {
  if (payload.autohost) return;
  if (!payload.viewers || payload.viewers < 10) return;

  logger.debug('new host/raid');

  // Get userdata for the display name and id of the hostee / raider
  const [userData] = await twitchCache.getUsers([payload.username]);
  if (userData) {
    payload.displayName = userData.display_name;
    const [channelData] = await twitchApi.getChannels([userData.id]);
    if (channelData) payload.game = channelData.game_name;
  }

  // if (payload.raid) {
  // raidMode.auto() // todo trigger raidmode
  // }

  // Emit to client regardless if successful database save
  const hostDoc = HostService.create(payload);
  io.emit('host', hostDoc);
  HostService.save(hostDoc).catch((err) => {
    logger.error(err);
  });
};
