import { MessageAttachment, TextChannel } from 'discord.js';
import { client } from 'core';
import { GetTemporalDirectory } from 'helpers/fileHelper';

export const GetChannel = async (id: string) => client.channels.cache.get(id) as TextChannel;

export const GetMultipleChannels = async (ids: string[]) => ids.map((x) => client.channels.cache.get(x) as TextChannel);

export const GetDiscordCode = (str: string, lan = '') => `\`\`\`${lan}\n${str}\`\`\``;

export const GetTempAttachment = (path: string) => new MessageAttachment(GetTemporalDirectory(path));
