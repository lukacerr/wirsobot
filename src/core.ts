import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';

import { InitializeTemp } from 'helpers/fileHelper';
import { ITaskInformation } from 'common/globals';

import JSON_CONFIG from 'configuration/config.json';
import dotenv from 'dotenv';

dotenv.config();
InitializeTemp();
console.clear();

export const cfg = JSON_CONFIG as {
  botPrefix: string,
  schedulerTasks: ITaskInformation[]
};

// eslint-disable-next-line max-len
process.title = `Wirsobot | Prefix: ${cfg.botPrefix} | Database ${process.env.DB_HOST}:${process.env.DB_PORT} (${process.env.DB_NAME}) | Bot token ${process.env.BOT_TOKEN}`;

export const dataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  migrationsRun: false,
  dropSchema: false,
  logging: false,
  entities: [`${__dirname}/models/*.ts`, `${__dirname}/entity/*.js`],
  options: {
    readOnlyIntent: true,
  },
  extra: {
    options: {
      encrypt: false,
      trustedConnection: true,
    },
  },
});
export const db = dataSource.manager;

export const AppId = process.env.BOT_ID as string;
export const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN as string);
export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(process.env.BOT_TOKEN);
