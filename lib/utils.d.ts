declare const SECOND = 1;
declare const MINUTE: number;
declare const HOUR: number;
declare const DAY: number;
declare const WEEK: number;
declare const YEAR: number;
declare const MONTH: number;
declare const startOfDay: (d: Date) => Date;
declare const convertToUnit: (seconds: number, unit: Intl.RelativeTimeFormatUnit) => number;
declare const fetchFormatter: {
    (locale: string | undefined, formatOptions: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;
    cache: import("quick-lru").default<string, Intl.DateTimeFormat>;
};
declare const fetchRelativeFormatter: {
    (locale: string | undefined, formatOptions: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat;
    cache: import("quick-lru").default<string, Intl.RelativeTimeFormat>;
};
declare const resolveLocale: (locale: string | undefined) => string | undefined;
export { convertToUnit, DAY, fetchFormatter, fetchRelativeFormatter, HOUR, MINUTE, MONTH, resolveLocale, SECOND, startOfDay, WEEK, YEAR, };
