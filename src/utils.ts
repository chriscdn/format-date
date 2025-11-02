import { Memoize } from "@chriscdn/memoize";

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365 * DAY; // Approximate

// this happens to have no remainder.
const MONTH = YEAR / 12;
const QUARTER = YEAR / 4;

const _round = (num: number, significantDigits: number) => {
  const factor = 10 ** significantDigits;
  return Math.round(num * factor) / factor;
};

const startOfDay = (d: Date) => {
  const newDate = new Date(d.getTime());
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};

const convertToUnit = (seconds: number, unit: Intl.RelativeTimeFormatUnit) => {
  switch (unit) {
    case "year":
    case "years":
      return _round(seconds / YEAR, 1);
    case "quarter":
    case "quarters":
      return Math.round(seconds / QUARTER);
    case "month":
    case "months":
      return Math.round(seconds / MONTH);
    case "week":
    case "weeks":
      return Math.round(seconds / WEEK);
    case "day":
    case "days":
      return Math.round(seconds / DAY);
    case "hour":
    case "hours":
      return Math.round(seconds / HOUR);
    case "minute":
    case "minutes":
      return Math.round(seconds / MINUTE);
    case "second":
    case "seconds":
      return seconds;
  }
};

const fetchFormatter = Memoize(
  (locale: string | undefined, formatOptions: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, formatOptions),
  { maxSize: 20 },
);

const fetchRelativeFormatter = Memoize(
  (locale: string | undefined, formatOptions: Intl.RelativeTimeFormatOptions) =>
    new Intl.RelativeTimeFormat(locale, formatOptions),
  { maxSize: 20 },
);

const resolveLocale = (locale: string | undefined) => locale?.replace("_", "-");

export {
  convertToUnit,
  DAY,
  fetchFormatter,
  fetchRelativeFormatter,
  HOUR,
  MINUTE,
  MONTH,
  resolveLocale,
  SECOND,
  startOfDay,
  WEEK,
  YEAR,
};
