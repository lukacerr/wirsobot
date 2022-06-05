export interface ITaskInformation { functionName: string, timer: number, useTemp?: boolean, otherParams?: unknown }

export const Sleep = (s: number) => new Promise((resolve) => { setTimeout(resolve, s * 1000); });
