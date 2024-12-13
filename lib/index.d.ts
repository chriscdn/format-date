import { EpochUnit, toDate } from "@chriscdn/to-date";
import { FormatDatePreset } from "./presets";
type DateRepresentation = Parameters<typeof toDate>[0];
type DateRepresentationNull = DateRepresentation | undefined | null;
export { FormatDatePreset } from "./presets";
export type FormatDateOptions = {
    locale?: string;
    preset?: FormatDatePreset;
    formatOptions?: Intl.DateTimeFormatOptions;
    epochUnit?: EpochUnit;
};
declare const formatDate: (value: DateRepresentationNull, options?: FormatDateOptions) => string;
declare const formatDateYYYYMMDD: (value: DateRepresentationNull) => string;
export { formatDate, formatDateYYYYMMDD };
