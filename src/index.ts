import { EpochUnit, isDate, toDate } from "@chriscdn/to-date";
import { Memoize } from "@chriscdn/memoize";
import { fetchPreset, FormatDatePreset } from "./presets";
import { getUserLocale } from "get-user-locale";

export type DateRepresentation = Parameters<typeof toDate>[0];
export type DateRepresentationNull = DateRepresentation | undefined | null;
export { FormatDatePreset } from "./presets";

export type FormatDateOptions = {
  locale?: string;
  preset?: FormatDatePreset;
  formatOptions?: Intl.DateTimeFormatOptions;
  epochUnit?: EpochUnit;
};

export type FormatDateRelativeOptions = {
  locale?: string;
  formatOptions?: Intl.RelativeTimeFormatOptions;
  unit?: Intl.RelativeTimeFormatUnit;
  epochUnit?: EpochUnit;
};

const _fetchFormatter = Memoize(
  (locale: string, formatOptions: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, formatOptions),
  { maxSize: 20 },
);

const _fetchRelativeFormatter = Memoize(
  (locale: string, formatOptions: Intl.RelativeTimeFormatOptions) =>
    new Intl.RelativeTimeFormat(locale, formatOptions),
  { maxSize: 20 },
);

/**
 * Get the browser locale, if possible. This will likely fail in SSR (i.e.,
 * Nuxt). Converts underscores to dashes.
 *
 * @param options {Options}
 * @returns
 */
const _browserLocale = Memoize(
  (options: FormatDateOptions | FormatDateRelativeOptions) =>
    (options.locale ?? getUserLocale({ fallbackLocale: "en-GB" })).replace(
      "_",
      "-",
    ),
);

const formatDate = Memoize(
  (value: DateRepresentationNull, options: FormatDateOptions = {}) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
    const date = toDate(value, epochUnit);

    if (isDate(date)) {
      const locale: Intl.LocalesArgument = _browserLocale(options);
      const preset = options.preset ?? FormatDatePreset.DateTime;

      const formatOptions = options.formatOptions ?? {};

      const intlFormatterOptions = fetchPreset(preset);

      const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        ...intlFormatterOptions,
        ...formatOptions,
      };

      const dateFormatter = _fetchFormatter(locale, dateTimeFormatOptions);

      return dateFormatter.format(date);
    } else {
      return null;
    }
  },
);

const formatDateYYYYMMDD = Memoize((value: DateRepresentationNull) => {
  const d = toDate(value);

  if (isDate(d)) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return [
      year,
      month.toString().padStart(2, "0"),
      day.toString().padStart(2, "0"),
    ].join("-");
  } else {
    return null;
  }
});

const formatDateYYYYMMDDTHHMMSS = Memoize((value: DateRepresentationNull) => {
  const d = toDate(value);

  if (d) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    return [
      [
        year,
        month.toString().padStart(2, "0"),
        day.toString().padStart(2, "0"),
      ].join("-"),
      [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":"),
    ].join("T");
  } else {
    return null;
  }
});

const _convertToUnit = (seconds: number, unit: Intl.RelativeTimeFormatUnit) => {
  switch (unit) {
    case "year":
    case "years":
      return Math.round(seconds / (60 * 60 * 24 * 365));
    case "quarter":
    case "quarters":
      return Math.round(seconds / (60 * 60 * 24 * 91.25));
    case "month":
    case "months":
      return Math.round(seconds / (60 * 60 * 24 * 30.4375));
    case "week":
    case "weeks":
      return Math.round(seconds / (60 * 60 * 24 * 7));
    case "day":
    case "days":
      return Math.round(seconds / (60 * 60 * 24));
    case "hour":
    case "hours":
      return Math.round(seconds / (60 * 60));
    case "minute":
    case "minutes":
      return Math.round(seconds / 60);
    case "second":
    case "seconds":
      return seconds;
  }
};

const formatDateRange = Memoize(
  (
    start: DateRepresentationNull,
    end: DateRepresentationNull,
    options: FormatDateOptions = {},
  ) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;

    const startDate = toDate(start, epochUnit);
    const endDate = toDate(end, epochUnit);

    if (isDate(startDate) && isDate(endDate)) {
      const locale: Intl.LocalesArgument = _browserLocale(options);
      const formatOptions = options.formatOptions ?? {};

      // Opinionated default to {dateStyle: "long"}
      const formatter = _fetchFormatter(locale, {
        dateStyle: "long",
        ...formatOptions,
      });

      // @ts-ignore Seems to be a TS error here for whatever reason.
      return formatter.formatRange(startDate, endDate);
    } else {
      return null;
    }
  },
);

/**
 * We cannot Memoize this function since "now" isn't fixed.
 */
const formatDateRelative = (
  value: DateRepresentationNull,
  options: FormatDateRelativeOptions = {},
  _now: DateRepresentationNull = undefined,
) => {
  const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;

  const date = toDate(value, epochUnit);
  const now = toDate(_now) ?? new Date();

  if (isDate(date) && isDate(now)) {
    const locale: Intl.LocalesArgument = _browserLocale(options);

    const formatOptions = options.formatOptions ?? {};

    const now = toDate(_now) ?? new Date();
    const date = toDate(value, epochUnit);

    const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const absDiff = Math.abs(diffInSeconds);

    let unit!: Intl.RelativeTimeFormatUnit;

    if (options.unit) {
      unit = options.unit;
    } else if (absDiff < 60) {
      unit = "second";
    } else if (absDiff < 3600) {
      unit = "minute";
    } else if (absDiff < 86400) {
      unit = "hour";
    } else if (absDiff < 2592000) {
      unit = "day";
    } else if (absDiff < 31536000) {
      unit = "month";
    } else {
      unit = "year";
    }

    const diffInUnits = _convertToUnit(diffInSeconds, unit);

    const dateRelativeFormatter = _fetchRelativeFormatter(
      locale,
      formatOptions,
    );

    return dateRelativeFormatter.format(diffInUnits, unit);
  } else {
    return null;
  }
};

export {
  formatDate,
  formatDateRange,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS,
  formatDateRelative,
};
