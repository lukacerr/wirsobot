import { AppId, client, rest } from 'core';
import { Routes } from 'discord-api-types/v9';
import { ClearTemp, CreateTempFolder, TempDirExists } from 'helpers/fileHelper';

import commands from 'configuration/commandConfig';

const JSONcBody = commands.map((c) => c.builder.toJSON());

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = commands.find((c) => c.name === interaction.commandName);

  if (command) {
    console.log(`Executing '${command.name}' for ${interaction.user.tag}:`);
    if (command.preExecution) await (command.preExecution as Function)();
    await command.fn(interaction);
    if (command.useTemp) ClearTemp(command.name);
    console.log(`Ended '${command.name}' execution.`);
  }
});

const loadCommandsByGuild = (gId: string) => {
  rest.put(Routes.applicationGuildCommands(AppId, gId), { body: JSONcBody })
    .then(() => console.log(`All commands/interactions loaded for guild ${gId}.`))
    .catch(() => console.log(`Unable to load commands/interactions for guild ${gId}.`));
};

client.on('guildCreate', ({ id }) => loadCommandsByGuild(id));

export default async () => {
  console.log('Initializing bot commands and interactions...');
  commands.forEach((c) => c.useTemp && !TempDirExists(c.name) && CreateTempFolder(c.name));
  client.guilds.cache.map((guild) => guild.id).forEach(loadCommandsByGuild);
};
