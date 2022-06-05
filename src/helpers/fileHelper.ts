import fs from 'fs';
import fsExtra from 'fs-extra';

const callbackHandle: fs.NoParamCallback = (e) => { if (e?.errno) throw e; };

export const GetTemporalDirectory = (dir: string) => `temp${dir === '' ? '' : `/${dir}`}`;

export const CreateTempFolder = (dir = '') => fs.mkdir(GetTemporalDirectory(dir), callbackHandle);

export const WriteToTempAsync = (filename: string, extension: string, content = '', folder = '') => fs
  .writeFile(`${GetTemporalDirectory(folder)}/${filename}.${extension}`, content, { flag: 'w' }, callbackHandle);

export const WriteToTemp = (filename: string, extension: string, content = '', folder = '') => fs
  .writeFileSync(`${GetTemporalDirectory(folder)}/${filename}.${extension}`, content, { flag: 'w' });

export const ClearTemp = (dir = '') => fsExtra.emptyDir(GetTemporalDirectory(dir));

export const TempDirExists = (dir = '') => fs.existsSync(GetTemporalDirectory(dir));

export const InitializeTemp = () => (TempDirExists() ? ClearTemp() : CreateTempFolder());
