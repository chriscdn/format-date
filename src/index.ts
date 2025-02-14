import { EpochUnit, isDate, toDate } from "@chriscdn/to-date";
import { Memoize } from "@chriscdn/memoize";
import { fetchPreset, FormatDatePreset } from "./presets";
import {
  convertToUnit,
  DAY,
  fetchFormatter,
  fetchRelativeFormatter,
  HOUR,
  MINUTE,
  MONTH,
  startOfDay,
  WEEK,
  YEAR,
} from "./utils";

export type DateRepresentation = Parameters<typeof toDate>[0];
export type DateRepresentationNull = DateRepresentation | undefined | null;
export { FormatDatePreset } from "./presets";

export type FormatDateOptions = {
  locale?: string;
  preset?: FormatDatePreset;
  formatOptions?: Intl.DateTimeFormatOptions;
  epochUnit?: EpochUnit;
};

export type FormatDateRangeOptions = {
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  epochUnit?: EpochUnit;
};

export type FormatDateRelativeOptions = {
  locale?: string;
  formatOptions?: Intl.RelativeTimeFormatOptions;
  unit?: Intl.RelativeTimeFormatUnit;
  epochUnit?: EpochUnit;
};

const formatDate = Memoize(
  (value: DateRepresentationNull, options: FormatDateOptions = {}) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
    const date = toDate(value, epochUnit);

    if (isDate(date)) {
      const locale = options.locale ?? undefined;
      const preset = options.preset ?? FormatDatePreset.DateTime;

      const formatOptions = options.formatOptions ?? {};

      const intlFormatterOptions = fetchPreset(preset);

      const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        ...intlFormatterOptions,
        ...formatOptions,
      };

      const dateFormatter = fetchFormatter(locale, dateTimeFormatOptions);

      return dateFormatter.format(date);
    } else {
      return null;
    }
  },
);

const formatDateYYYYMMDD = Memoize(
  (
    value: DateRepresentationNull,
    timeZone?: Intl.DateTimeFormatOptions["timeZone"],
  ) => {
    const date = toDate(value);

    if (isDate(date)) {
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const formatter = fetchFormatter("en-US", options);
      const parts = formatter.formatToParts(date);

      const year = parts.find((part) => part.type === "year")!.value;
      const month = parts.find((part) => part.type === "month")!.value;
      const day = parts.find((part) => part.type === "day")!.value;

      // Return the formatted date in the form "YYYY-MM-DD"
      return `${year}-${month}-${day}`;
    } else {
      return null;
    }
  },
);

const formatDateYYYYMMDDTHHMMSS = Memoize(
  (
    value: DateRepresentationNull,
    timeZone?: Intl.DateTimeFormatOptions["timeZone"],
  ) => {
    const date = toDate(value);

    if (isDate(date)) {
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const formatter = fetchFormatter("en-US", options);
      const parts = formatter.formatToParts(date);

      // Extract the formatted components from the parts
      const year = parts.find((part) => part.type === "year")!.value;
      const month = parts.find((part) => part.type === "month")!.value;
      const day = parts.find((part) => part.type === "day")!.value;
      const hours = parts.find((part) => part.type === "hour")!.value;
      const minutes = parts.find((part) => part.type === "minute")!.value;
      const seconds = parts.find((part) => part.type === "second")!.value;

      // Return the formatted date in the form "YYYY-MM-DDTHH:MM:SS"
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } else {
      return null;
    }
  },
);

const formatDateRange = Memoize(
  (
    start: DateRepresentationNull,
    end: DateRepresentationNull,
    options: FormatDateRangeOptions = {},
  ) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;

    const startDate = toDate(start, epochUnit);
    const endDate = toDate(end, epochUnit);

    if (isDate(startDate) && isDate(endDate)) {
      const locale = options.locale ?? undefined;
      const formatOptions = options.formatOptions ?? {};

      // Opinionated default to {dateStyle: "long"}
      const formatter = fetchFormatter(locale, {
        // dateStyle: "long",
        ...formatOptions,
      });

      // @ts-ignore Seems to be a TS error here for whatever reason.
      return formatter.formatRange(startDate, endDate);
    } else {
      return null;
    }
  },
);

const formatDateRelative = (
  value: DateRepresentationNull,
  options: FormatDateRelativeOptions = {},
  _now: DateRepresentationNull = undefined,
) => {
  // We cannot Memoize this function since "now" isn't fixed.

  const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;

  const date = toDate(value, epochUnit);
  const now = toDate(_now, epochUnit) ?? new Date();

  if (isDate(date) && isDate(now)) {
    const locale = options.locale;

    const formatOptions = options.formatOptions ?? {};

    const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const absDiff = Math.abs(diffInSeconds);

    let unit!: Intl.RelativeTimeFormatUnit;

    if (options.unit) {
      unit = options.unit;
    } else if (absDiff < MINUTE) {
      unit = "second";
    } else if (absDiff < HOUR) {
      unit = "minute";
    } else if (absDiff < DAY) {
      unit = "hour";
    } else if (absDiff < 2 * WEEK) {
      unit = "day";
    } else if (absDiff < 2 * MONTH) {
      unit = "week";
    } else if (absDiff < YEAR) {
      unit = "month";
    } else {
      unit = "year";
    }

    // If the difference is greater than 24hrs, then switch our diff in seconds
    // to be in units of whole days. This will ensure our relative date is
    // respective of calendar days and not units of 24hrs.

    const resolvedDiffInSeconds =
      absDiff > DAY
        ? Math.round(
            (startOfDay(date).getTime() - startOfDay(now).getTime()) / 1000,
          )
        : diffInSeconds;

    const diffInUnits = convertToUnit(resolvedDiffInSeconds, unit);

    const dateRelativeFormatter = fetchRelativeFormatter(locale, formatOptions);

    return dateRelativeFormatter.format(diffInUnits, unit);
  } else {
    return null;
  }
};

export {
  formatDate,
  formatDateRange,
  formatDateRelative,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS,
};
