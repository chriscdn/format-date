import { EpochUnit, isDate, toDate, toDateOrThrow } from "@chriscdn/to-date";
import { Memoize } from "@chriscdn/memoize";
import { fetchPreset, FormatDatePreset } from "./presets";
import {
  convertToUnit,
  fetchFormatter,
  fetchRelativeFormatter,
  resolveLocale,
  startOfDay,
  TimeInSeconds,
} from "./utils";

type DateInput = string | number | Date | undefined | null;

type FormatDateOptions = {
  locale?: string;
  preset?: FormatDatePreset;
  formatOptions?: Intl.DateTimeFormatOptions;
  epochUnit?: EpochUnit;
};

type FormatDateRangeOptions = {
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  epochUnit?: EpochUnit;
};

type FormatDateRelativeOptions = {
  locale?: string;
  formatOptions?: Intl.RelativeTimeFormatOptions;
  unit?: Intl.RelativeTimeFormatUnit;
  epochUnit?: EpochUnit;
  relativeTo?: DateInput;
};

/**
 * Formats a date into a localized string based on a preset or custom options.
 *
 * @param value - The date input to format (string, number, Date, or null/undefined).
 * @param options - Configuration for locale, presets, and specific Intl options.
 * @returns The formatted date string, or null if the input is invalid.
 */
const formatDate = Memoize(
  (value: DateInput, options: FormatDateOptions = {}) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
    const date = toDate(value, epochUnit);

    if (isDate(date)) {
      const locale = resolveLocale(options.locale);
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

/**
 * Formats a date into a "YYYY-MM-DD" string format.
 *
 * @param value - The date input to format.
 * @param timeZone - Optional IANA time zone identifier.
 * @returns A string in YYYY-MM-DD format, or null if the input is invalid.
 */
const formatDateYYYYMMDD = Memoize(
  (value: DateInput, timeZone?: Intl.DateTimeFormatOptions["timeZone"]) => {
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

      // works around year quirk
      const year = parts
        .find((part) => part.type === "year")!
        .value.padStart(4, "0");
      const month = parts.find((part) => part.type === "month")!.value;
      const day = parts.find((part) => part.type === "day")!.value;

      // Return the formatted date in the form "YYYY-MM-DD"
      return `${year}-${month}-${day}`;
    } else {
      return null;
    }
  },
);

/**
 * Formats a date into a "YYYY-MM-DDTHH:MM:SS" string format.
 *
 * @param value - The date input to format.
 * @param timeZone - Optional IANA time zone identifier.
 * @returns A string in YYYY-MM-DDTHH:MM:SS format, or null if the input is invalid.
 */
const formatDateYYYYMMDDTHHMMSS = Memoize(
  (value: DateInput, timeZone?: Intl.DateTimeFormatOptions["timeZone"]) => {
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
      const year = parts
        .find((part) => part.type === "year")!
        .value.padStart(4, "0");
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

/**
 * Formats a range between two dates into a localized string.
 *
 * @param start - The start date of the range.
 * @param end - The end date of the range.
 * @param options - Configuration for locale and Intl format options.
 * @returns A formatted range string (e.g., "Jan 1 – 5, 2024"), or null if inputs are invalid.
 */
const formatDateRange = Memoize(
  (start: DateInput, end: DateInput, options: FormatDateRangeOptions = {}) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;

    const startDate = toDate(start, epochUnit);
    const endDate = toDate(end, epochUnit);

    if (isDate(startDate) && isDate(endDate)) {
      const locale = resolveLocale(options.locale);
      const formatOptions = options.formatOptions ?? {};

      // Opinionated default to {dateStyle: "long"}
      const formatter = fetchFormatter(locale, {
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
 * Formats a date relative to another date (defaults to now) in a human-readable way.
 *
 * @param value - The date to be formatted.
 * @param options - Configuration for locale, specific units, and the reference date.
 * @returns A relative string (e.g., "2 days ago", "in 3 months"), or null if input is invalid.
 */
const formatDateRelative = (
  value: DateInput,
  options: FormatDateRelativeOptions = {},
) => {
  // We cannot Memoize this function since "now" isn't fixed.

  const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;

  const date = toDate(value, epochUnit);
  const relativeTo = options.relativeTo
    ? toDateOrThrow(options.relativeTo, epochUnit)
    : new Date();

  if (isDate(date) && isDate(relativeTo)) {
    const locale = resolveLocale(options.locale);

    const formatOptions = options.formatOptions ?? {};

    const diffInSeconds = Math.round(
      (date.getTime() - relativeTo.getTime()) / 1000,
    );
    const absDiff = Math.abs(diffInSeconds);

    let unit!: Intl.RelativeTimeFormatUnit;

    if (options.unit) {
      unit = options.unit;
    } else if (absDiff < TimeInSeconds.MINUTE) {
      unit = "second";
    } else if (absDiff < TimeInSeconds.HOUR) {
      unit = "minute";
    } else if (absDiff < TimeInSeconds.DAY) {
      unit = "hour";
    } else if (absDiff < 2 * TimeInSeconds.WEEK) {
      unit = "day";
    } else if (absDiff < 2 * TimeInSeconds.MONTH) {
      unit = "week";
    } else if (absDiff < TimeInSeconds.YEAR) {
      unit = "month";
    } else {
      unit = "year";
    }

    // If the difference is greater than 24hrs, then switch our diff in seconds
    // to be in units of whole days. This will ensure our relative date is
    // respective of calendar days and not units of 24hrs.

    const resolvedDiffInSeconds =
      absDiff > TimeInSeconds.DAY
        ? Math.round(
            (startOfDay(date).getTime() - startOfDay(relativeTo).getTime()) /
              1000,
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
  type FormatDateOptions,
  FormatDatePreset,
  formatDateRange,
  type FormatDateRangeOptions,
  formatDateRelative,
  type FormatDateRelativeOptions,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS,
};
