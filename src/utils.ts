import { Memoize } from "@chriscdn/memoize";

const TimeInSeconds = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
  WEEK: 7 * 24 * 60 * 60,
  YEAR: 365 * 24 * 60 * 60, // approximate
  MONTH: (365 * 24 * 60 * 60) / 12, // approximate
  QUARTER: (365 * 24 * 60 * 60) / 4, // approximate
} as const;

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
      return _round(seconds / TimeInSeconds.YEAR, 1);
    case "quarter":
    case "quarters":
      return Math.round(seconds / TimeInSeconds.QUARTER);
    case "month":
    case "months":
      return Math.round(seconds / TimeInSeconds.MONTH);
    case "week":
    case "weeks":
      return Math.round(seconds / TimeInSeconds.WEEK);
    case "day":
    case "days":
      return Math.round(seconds / TimeInSeconds.DAY);
    case "hour":
    case "hours":
      return Math.round(seconds / TimeInSeconds.HOUR);
    case "minute":
    case "minutes":
      return Math.round(seconds / TimeInSeconds.MINUTE);
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
  fetchFormatter,
  fetchRelativeFormatter,
  resolveLocale,
  startOfDay,
  TimeInSeconds,
};
