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
declare const formatDate: {
    (value: DateRepresentationNull, options?: FormatDateOptions | undefined): string | null;
    cache: import("quick-lru").default<string, string | null>;
};
declare const formatDateYYYYMMDD: {
    (value: DateRepresentationNull, timeZone?: string | undefined): string | null;
    cache: import("quick-lru").default<string, string | null>;
};
declare const formatDateYYYYMMDDTHHMMSS: {
    (value: DateRepresentationNull, timeZone?: string | undefined): string | null;
    cache: import("quick-lru").default<string, string | null>;
};
declare const formatDateRange: {
    (start: DateRepresentationNull, end: DateRepresentationNull, options?: FormatDateRangeOptions | undefined): string | null;
    cache: import("quick-lru").default<string, string | null>;
};
declare const formatDateRelative: (value: DateRepresentationNull, options?: FormatDateRelativeOptions, _now?: DateRepresentationNull) => string | null;
export { formatDate, formatDateRange, formatDateRelative, formatDateYYYYMMDD, formatDateYYYYMMDDTHHMMSS, };
