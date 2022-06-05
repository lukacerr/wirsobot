import { cfg, client, dataSource } from 'core';

import scheduleHandler from 'handlers/scheduleHandler';
import commandHandler from 'handlers/commandHandler';

client.once('ready', async () => {
  console.log('Initializing database connection...');
  dataSource.initialize().then(async () => {
    scheduleHandler(cfg.schedulerTasks);
    commandHandler();
  });
});

console.log('Logging bot client...');
