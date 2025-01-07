import { EpochUnit, isDate, toDate } from "@chriscdn/to-date";
import { Memoize } from "@chriscdn/memoize";
import { fetchPreset, FormatDatePreset } from "./presets";
import { getUserLocale } from "get-user-locale";

type DateRepresentation = Parameters<typeof toDate>[0];
type DateRepresentationNull = DateRepresentation | undefined | null;
export { FormatDatePreset } from "./presets";

export type FormatDateOptions = {
    locale?: string;
    preset?: FormatDatePreset;
    formatOptions?: Intl.DateTimeFormatOptions;
    epochUnit?: EpochUnit;
};

const _fetchFormatter = Memoize((
    locale: string,
    formatOptions: Intl.DateTimeFormatOptions,
) => Intl.DateTimeFormat(locale, formatOptions), { maxSize: 20 });

const _formatDate = Memoize((
    value: DateRepresentation,
    locale: string,
    epochUnit: EpochUnit,
    formatOptions: Intl.DateTimeFormatOptions,
) => {
    const date = toDate(value, epochUnit);
    const dateFormatter = _fetchFormatter(locale, formatOptions);
    return isDate(date) ? dateFormatter.format(date) : undefined;
});

/**
 * Get the browser locale, if possible. This will likely fail in SSR (i.e.,
 * Nuxt). Converts underscores to dashes.
 *
 * @param options {Options}
 * @returns
 */
const _browserLocale = Memoize((options: FormatDateOptions) =>
    (options.locale ??
        getUserLocale(
            { fallbackLocale: "en-GB" },
        )).replace(
            "_",
            "-",
        )
);

const formatDate = Memoize(
    (value: DateRepresentationNull, options: FormatDateOptions = {}) => {
        if (value === undefined || value === null) {
            return null;
        } else {
            const locale: Intl.LocalesArgument = _browserLocale(options);
            const preset = options.preset ?? FormatDatePreset.DateTime;
            const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
            const formatOptions = options.formatOptions ?? {};

            const intlFormatterOptions = fetchPreset(preset);

            const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
                ...intlFormatterOptions,
                ...formatOptions,
            };

            return _formatDate(value, locale, epochUnit, dateTimeFormatOptions);
        }
    },
);

const formatDateYYYYMMDD = Memoize((value: DateRepresentationNull) => {
    const d = toDate(value);

    if (d) {
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

export { formatDate, formatDateYYYYMMDD, formatDateYYYYMMDDTHHMMSS };
