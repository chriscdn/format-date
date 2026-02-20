import * as quick_lru from 'quick-lru';
import { toDate, EpochUnit } from '@chriscdn/to-date';

declare enum FormatDatePreset {
    None = 0,
    DateTime = 1,
    DateTimeMedium = 2,
    DateTimeShort = 3,
    Date = 4,
    DateMedium = 5,
    DateShort = 6
}

type DateRepresentation = Parameters<typeof toDate>[0];
type DateRepresentationNull = DateRepresentation | undefined | null;

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
};
declare const formatDate: {
    (value: DateRepresentationNull, options?: FormatDateOptions | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateYYYYMMDD: {
    (value: DateRepresentationNull, timeZone?: string | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateYYYYMMDDTHHMMSS: {
    (value: DateRepresentationNull, timeZone?: string | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateRange: {
    (start: DateRepresentationNull, end: DateRepresentationNull, options?: FormatDateRangeOptions | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateRelative: (value: DateRepresentationNull, options?: FormatDateRelativeOptions, _now?: DateRepresentationNull) => string | null;

export { type DateRepresentation, type DateRepresentationNull, type FormatDateOptions, FormatDatePreset, type FormatDateRangeOptions, type FormatDateRelativeOptions, formatDate, formatDateRange, formatDateRelative, formatDateYYYYMMDD, formatDateYYYYMMDDTHHMMSS };
