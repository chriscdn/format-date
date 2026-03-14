import * as quick_lru from 'quick-lru';
import { EpochUnit } from '@chriscdn/to-date';

declare enum FormatDatePreset {
    None = 0,
    DateTime = 1,
    DateTimeMedium = 2,
    DateTimeShort = 3,
    Date = 4,
    DateMedium = 5,
    DateShort = 6
}

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
declare const formatDate: {
    (value: DateInput, options?: FormatDateOptions | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
/**
 * Formats a date into a "YYYY-MM-DD" string format.
 *
 * @param value - The date input to format.
 * @param timeZone - Optional IANA time zone identifier.
 * @returns A string in YYYY-MM-DD format, or null if the input is invalid.
 */
declare const formatDateYYYYMMDD: {
    (value: DateInput, timeZone?: string | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
/**
 * Formats a date into a "YYYY-MM-DDTHH:MM:SS" string format.
 *
 * @param value - The date input to format.
 * @param timeZone - Optional IANA time zone identifier.
 * @returns A string in YYYY-MM-DDTHH:MM:SS format, or null if the input is invalid.
 */
declare const formatDateYYYYMMDDTHHMMSS: {
    (value: DateInput, timeZone?: string | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
/**
 * Formats a range between two dates into a localized string.
 *
 * @param start - The start date of the range.
 * @param end - The end date of the range.
 * @param options - Configuration for locale and Intl format options.
 * @returns A formatted range string (e.g., "Jan 1 – 5, 2024"), or null if inputs are invalid.
 */
declare const formatDateRange: {
    (start: DateInput, end: DateInput, options?: FormatDateRangeOptions | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
/**
 * Formats a date relative to another date (defaults to now) in a human-readable way.
 *
 * @param value - The date to be formatted.
 * @param options - Configuration for locale, specific units, and the reference date.
 * @returns A relative string (e.g., "2 days ago", "in 3 months"), or null if input is invalid.
 */
declare const formatDateRelative: (value: DateInput, options?: FormatDateRelativeOptions) => string | null;

export { type FormatDateOptions, FormatDatePreset, type FormatDateRangeOptions, type FormatDateRelativeOptions, formatDate, formatDateRange, formatDateRelative, formatDateYYYYMMDD, formatDateYYYYMMDDTHHMMSS };
