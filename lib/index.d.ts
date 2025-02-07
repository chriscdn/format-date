import { EpochUnit, toDate } from "@chriscdn/to-date";
import { FormatDatePreset } from "./presets";
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
declare const formatDate: {
    (value: DateRepresentationNull, options?: FormatDateOptions): string;
    cache: import("quick-lru").default<string, string>;
};
declare const formatDateYYYYMMDD: {
    (value: DateRepresentationNull): string;
    cache: import("quick-lru").default<string, string>;
};
declare const formatDateYYYYMMDDTHHMMSS: {
    (value: DateRepresentationNull): string;
    cache: import("quick-lru").default<string, string>;
};
declare const formatDateRange: {
    (start: DateRepresentationNull, end: DateRepresentationNull, options?: FormatDateOptions): string;
    cache: import("quick-lru").default<string, string>;
};
/**
 * We cannot Memoize this function since "now" isn't fixed.
 */
declare const formatDateRelative: (value: DateRepresentationNull, options?: FormatDateRelativeOptions, _now?: DateRepresentationNull) => string;
export { formatDate, formatDateRange, formatDateYYYYMMDD, formatDateYYYYMMDDTHHMMSS, formatDateRelative, };
