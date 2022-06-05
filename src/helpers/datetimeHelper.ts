export const GetDateUTC = (date = new Date()) => new Date(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours(),
  date.getUTCMinutes(),
  date.getUTCSeconds(),
);

export const GetDateLocal = (date = new Date()) => new Date(date.getTime() - date.getTimezoneOffset() * 60000);

// DD/MM/YYYY HH:MM:SS
export const GetDateToString = (d = new Date()) => d.toLocaleString('en-GB').replace(',', '');
