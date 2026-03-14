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
declare const formatDate: {
    (value: DateInput, options?: FormatDateOptions | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateYYYYMMDD: {
    (value: DateInput, timeZone?: string | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateYYYYMMDDTHHMMSS: {
    (value: DateInput, timeZone?: string | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateRange: {
    (start: DateInput, end: DateInput, options?: FormatDateRangeOptions | undefined): string | null;
    cache: quick_lru.default<string, string | null>;
};
declare const formatDateRelative: (value: DateInput, options?: FormatDateRelativeOptions) => string | null;

export { type FormatDateOptions, FormatDatePreset, type FormatDateRangeOptions, type FormatDateRelativeOptions, formatDate, formatDateRange, formatDateRelative, formatDateYYYYMMDD, formatDateYYYYMMDDTHHMMSS };
