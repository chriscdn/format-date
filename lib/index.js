import { EpochUnit, isDate, toDate, toDateOrThrow } from "@chriscdn/to-date";
import { Memoize } from "@chriscdn/memoize";
//#region src/presets.ts
var FormatDatePreset = /* @__PURE__ */ function(FormatDatePreset) {
	FormatDatePreset[FormatDatePreset["None"] = 0] = "None";
	FormatDatePreset[FormatDatePreset["DateTime"] = 1] = "DateTime";
	FormatDatePreset[FormatDatePreset["DateTimeMedium"] = 2] = "DateTimeMedium";
	FormatDatePreset[FormatDatePreset["DateTimeShort"] = 3] = "DateTimeShort";
	FormatDatePreset[FormatDatePreset["Date"] = 4] = "Date";
	FormatDatePreset[FormatDatePreset["DateMedium"] = 5] = "DateMedium";
	FormatDatePreset[FormatDatePreset["DateShort"] = 6] = "DateShort";
	return FormatDatePreset;
}(FormatDatePreset || {});
const fetchPreset = (preset) => {
	switch (preset) {
		case 0: return {};
		case 1: return {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric"
		};
		case 2: return {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric"
		};
		case 3: return {
			dateStyle: "short",
			timeStyle: "short"
		};
		case 4: return {
			year: "numeric",
			month: "long",
			day: "2-digit"
		};
		case 5: return {
			year: "numeric",
			month: "short",
			day: "2-digit"
		};
		case 6: return {
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		};
		default: return { dateStyle: "full" };
	}
};
//#endregion
//#region src/utils.ts
const TimeInSeconds = {
	SECOND: 1,
	MINUTE: 60,
	HOUR: 3600,
	DAY: 86400,
	WEEK: 604800,
	YEAR: 31536e3,
	MONTH: 2628e3,
	QUARTER: 7884e3
};
const _round = (num, significantDigits) => {
	const factor = 10 ** significantDigits;
	return Math.round(num * factor) / factor;
};
const startOfDay = (d) => {
	const newDate = new Date(d.getTime());
	newDate.setUTCHours(0, 0, 0, 0);
	return newDate;
};
const convertToUnit = (seconds, unit) => {
	switch (unit) {
		case "year":
		case "years": return _round(seconds / TimeInSeconds.YEAR, 1);
		case "quarter":
		case "quarters": return Math.round(seconds / TimeInSeconds.QUARTER);
		case "month":
		case "months": return Math.round(seconds / TimeInSeconds.MONTH);
		case "week":
		case "weeks": return Math.round(seconds / TimeInSeconds.WEEK);
		case "day":
		case "days": return Math.round(seconds / TimeInSeconds.DAY);
		case "hour":
		case "hours": return Math.round(seconds / TimeInSeconds.HOUR);
		case "minute":
		case "minutes": return Math.round(seconds / TimeInSeconds.MINUTE);
		case "second":
		case "seconds": return seconds;
	}
};
const fetchFormatter = Memoize((locale, formatOptions) => new Intl.DateTimeFormat(locale, formatOptions), { maxSize: 20 });
const fetchRelativeFormatter = Memoize((locale, formatOptions) => new Intl.RelativeTimeFormat(locale, formatOptions), { maxSize: 20 });
const resolveLocale = (locale) => locale?.replace("_", "-");
//#endregion
//#region src/index.ts
/**
* Formats a date into a localized string based on a preset or custom options.
*
* @param value - The date input to format (string, number, Date, or null/undefined).
* @param options - Configuration for locale, presets, and specific Intl options.
* @returns The formatted date string, or null if the input is invalid.
*/
const formatDate = Memoize((value, options = {}) => {
	const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
	const date = toDate(value, epochUnit);
	if (isDate(date)) {
		const locale = resolveLocale(options.locale);
		const preset = options.preset ?? 1;
		const formatOptions = options.formatOptions ?? {};
		const dateTimeFormatOptions = {
			...fetchPreset(preset),
			...formatOptions
		};
		return fetchFormatter(locale, dateTimeFormatOptions).format(date);
	} else return null;
});
/**
* Formats a date into a "YYYY-MM-DD" string format.
*
* @param value - The date input to format.
* @param timeZone - Optional IANA time zone identifier.
* @returns A string in YYYY-MM-DD format, or null if the input is invalid.
*/
const formatDateYYYYMMDD = Memoize((value, timeZone) => {
	const date = toDate(value);
	if (isDate(date)) {
		const parts = fetchFormatter("en-US", {
			timeZone,
			hourCycle: "h23",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		}).formatToParts(date);
		return `${parts.find((part) => part.type === "year").value.padStart(4, "0")}-${parts.find((part) => part.type === "month").value}-${parts.find((part) => part.type === "day").value}`;
	} else return null;
});
/**
* Formats a date into a "YYYY-MM-DDTHH:MM:SS" string format.
*
* @param value - The date input to format.
* @param timeZone - Optional IANA time zone identifier.
* @returns A string in YYYY-MM-DDTHH:MM:SS format, or null if the input is invalid.
*/
const formatDateYYYYMMDDTHHMMSS = Memoize((value, timeZone) => {
	const date = toDate(value);
	if (isDate(date)) {
		const parts = fetchFormatter("en-US", {
			timeZone,
			hourCycle: "h23",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		}).formatToParts(date);
		return `${parts.find((part) => part.type === "year").value.padStart(4, "0")}-${parts.find((part) => part.type === "month").value}-${parts.find((part) => part.type === "day").value}T${parts.find((part) => part.type === "hour").value}:${parts.find((part) => part.type === "minute").value}:${parts.find((part) => part.type === "second").value}`;
	} else return null;
});
/**
* Formats a range between two dates into a localized string.
*
* @param start - The start date of the range.
* @param end - The end date of the range.
* @param options - Configuration for locale and Intl format options.
* @returns A formatted range string (e.g., "Jan 1 – 5, 2024"), or null if inputs are invalid.
*/
const formatDateRange = Memoize((start, end, options = {}) => {
	const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
	const startDate = toDate(start, epochUnit);
	const endDate = toDate(end, epochUnit);
	if (isDate(startDate) && isDate(endDate)) {
		const locale = resolveLocale(options.locale);
		const formatOptions = options.formatOptions ?? { dateStyle: "long" };
		return fetchFormatter(locale, formatOptions).formatRange(startDate, endDate).replace(/\s/g, " ");
	} else return null;
});
/**
* Formats a date relative to another date (defaults to now) in a human-readable way.
*
* @param value - The date to be formatted.
* @param options - Configuration for locale, specific units, and the reference date.
* @returns A relative string (e.g., "2 days ago", "in 3 months"), or null if input is invalid.
*/
const formatDateRelative = (value, options = {}) => {
	const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
	const date = toDate(value, epochUnit);
	const relativeTo = options.relativeTo ? toDateOrThrow(options.relativeTo, epochUnit) : /* @__PURE__ */ new Date();
	if (isDate(date) && isDate(relativeTo)) {
		const locale = resolveLocale(options.locale);
		const formatOptions = options.formatOptions ?? {};
		const diffInSeconds = Math.round((date.getTime() - relativeTo.getTime()) / 1e3);
		const absDiff = Math.abs(diffInSeconds);
		let unit;
		if (options.unit) unit = options.unit;
		else if (absDiff < TimeInSeconds.MINUTE) unit = "second";
		else if (absDiff < TimeInSeconds.HOUR) unit = "minute";
		else if (absDiff < TimeInSeconds.DAY) unit = "hour";
		else if (absDiff < 2 * TimeInSeconds.WEEK) unit = "day";
		else if (absDiff < 2 * TimeInSeconds.MONTH) unit = "week";
		else if (absDiff < TimeInSeconds.YEAR) unit = "month";
		else unit = "year";
		const resolvedDiffInSeconds = absDiff > TimeInSeconds.DAY ? Math.round((startOfDay(date).getTime() - startOfDay(relativeTo).getTime()) / 1e3) : diffInSeconds;
		const diffInUnits = convertToUnit(resolvedDiffInSeconds, unit);
		return fetchRelativeFormatter(locale, formatOptions).format(diffInUnits, unit);
	} else return null;
};
//#endregion
export { EpochUnit, FormatDatePreset, formatDate, formatDateRange, formatDateRelative, formatDateYYYYMMDD, formatDateYYYYMMDDTHHMMSS, isDate, toDate, toDateOrThrow };

//# sourceMappingURL=index.js.map