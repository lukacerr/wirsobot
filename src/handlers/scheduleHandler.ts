import { TempDirExists, ClearTemp, CreateTempFolder } from 'helpers/fileHelper';

import { ITaskInformation, Sleep } from 'common/globals';

import sendNewTraces from 'tasks/sendNewTracesTask';

const functionList: Function[] = [sendNewTraces];

export default async (taskInfoList: ITaskInformation[]) => {
  for (const task of taskInfoList) {
    const fn = functionList.find((func) => func.name === task.functionName) as Function;

    console.log(`Loading '${task.functionName}' scheduler task...`, task);
    await Sleep(5);
    if (task.useTemp && !TempDirExists(task.functionName)) CreateTempFolder(task.functionName);

    setInterval(async () => {
      try {
        console.log(`Running '${task.functionName}' task:`);
        await fn(task.otherParams);
        if (task.useTemp) ClearTemp(task.functionName);
        console.log(`Ended '${task.functionName}' task execution.`);
      } catch (e) {
        console.error(e);
      }
    }, task.timer * 1000);
  }

  console.log('All scheduler modules loaded.');
};
