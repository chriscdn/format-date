// src/index.ts
import { EpochUnit, isDate, toDate } from "@chriscdn/to-date";
import { Memoize as Memoize2 } from "@chriscdn/memoize";

// src/presets.ts
var FormatDatePreset = /* @__PURE__ */ ((FormatDatePreset2) => {
  FormatDatePreset2[FormatDatePreset2["None"] = 0] = "None";
  FormatDatePreset2[FormatDatePreset2["DateTime"] = 1] = "DateTime";
  FormatDatePreset2[FormatDatePreset2["DateTimeMedium"] = 2] = "DateTimeMedium";
  FormatDatePreset2[FormatDatePreset2["DateTimeShort"] = 3] = "DateTimeShort";
  FormatDatePreset2[FormatDatePreset2["Date"] = 4] = "Date";
  FormatDatePreset2[FormatDatePreset2["DateMedium"] = 5] = "DateMedium";
  FormatDatePreset2[FormatDatePreset2["DateShort"] = 6] = "DateShort";
  return FormatDatePreset2;
})(FormatDatePreset || {});
var fetchPreset = (preset) => {
  switch (preset) {
    case 0 /* None */:
      return {};
    case 1 /* DateTime */:
      return {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };
    case 2 /* DateTimeMedium */:
      return {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };
    case 3 /* DateTimeShort */:
      return {
        dateStyle: "short",
        timeStyle: "short"
      };
    case 4 /* Date */:
      return {
        year: "numeric",
        month: "long",
        day: "2-digit"
      };
    case 5 /* DateMedium */:
      return {
        year: "numeric",
        month: "short",
        day: "2-digit"
      };
    case 6 /* DateShort */:
      return {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      };
    default:
      return {
        dateStyle: "full"
      };
  }
};

// src/utils.ts
import { Memoize } from "@chriscdn/memoize";
var SECOND = 1;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = 7 * DAY;
var YEAR = 365 * DAY;
var MONTH = YEAR / 12;
var QUARTER = YEAR / 4;
var _round = (num, significantDigits) => {
  const factor = 10 ** significantDigits;
  return Math.round(num * factor) / factor;
};
var startOfDay = (d) => {
  const newDate = new Date(d.getTime());
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};
var convertToUnit = (seconds, unit) => {
  switch (unit) {
    case "year":
    case "years":
      return _round(seconds / YEAR, 1);
    case "quarter":
    case "quarters":
      return Math.round(seconds / QUARTER);
    case "month":
    case "months":
      return Math.round(seconds / MONTH);
    case "week":
    case "weeks":
      return Math.round(seconds / WEEK);
    case "day":
    case "days":
      return Math.round(seconds / DAY);
    case "hour":
    case "hours":
      return Math.round(seconds / HOUR);
    case "minute":
    case "minutes":
      return Math.round(seconds / MINUTE);
    case "second":
    case "seconds":
      return seconds;
  }
};
var fetchFormatter = Memoize(
  (locale, formatOptions) => new Intl.DateTimeFormat(locale, formatOptions),
  { maxSize: 20 }
);
var fetchRelativeFormatter = Memoize(
  (locale, formatOptions) => new Intl.RelativeTimeFormat(locale, formatOptions),
  { maxSize: 20 }
);
var resolveLocale = (locale) => locale?.replace("_", "-");

// src/index.ts
var formatDate = Memoize2(
  (value, options = {}) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
    const date = toDate(value, epochUnit);
    if (isDate(date)) {
      const locale = resolveLocale(options.locale);
      const preset = options.preset ?? 1 /* DateTime */;
      const formatOptions = options.formatOptions ?? {};
      const intlFormatterOptions = fetchPreset(preset);
      const dateTimeFormatOptions = {
        ...intlFormatterOptions,
        ...formatOptions
      };
      const dateFormatter = fetchFormatter(locale, dateTimeFormatOptions);
      return dateFormatter.format(date);
    } else {
      return null;
    }
  }
);
var formatDateYYYYMMDD = Memoize2(
  (value, timeZone) => {
    const date = toDate(value);
    if (isDate(date)) {
      const options = {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      const formatter = fetchFormatter("en-US", options);
      const parts = formatter.formatToParts(date);
      const year = parts.find((part) => part.type === "year").value.padStart(
        4,
        "0"
      );
      const month = parts.find((part) => part.type === "month").value;
      const day = parts.find((part) => part.type === "day").value;
      return `${year}-${month}-${day}`;
    } else {
      return null;
    }
  }
);
var formatDateYYYYMMDDTHHMMSS = Memoize2(
  (value, timeZone) => {
    const date = toDate(value);
    if (isDate(date)) {
      const options = {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      const formatter = fetchFormatter("en-US", options);
      const parts = formatter.formatToParts(date);
      const year = parts.find((part) => part.type === "year").value.padStart(
        4,
        "0"
      );
      const month = parts.find((part) => part.type === "month").value;
      const day = parts.find((part) => part.type === "day").value;
      const hours = parts.find((part) => part.type === "hour").value;
      const minutes = parts.find((part) => part.type === "minute").value;
      const seconds = parts.find((part) => part.type === "second").value;
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } else {
      return null;
    }
  }
);
var formatDateRange = Memoize2(
  (start, end, options = {}) => {
    const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
    const startDate = toDate(start, epochUnit);
    const endDate = toDate(end, epochUnit);
    if (isDate(startDate) && isDate(endDate)) {
      const locale = resolveLocale(options.locale);
      const formatOptions = options.formatOptions ?? {};
      const formatter = fetchFormatter(locale, {
        dateStyle: "long",
        ...formatOptions
      });
      return formatter.formatRange(startDate, endDate);
    } else {
      return null;
    }
  }
);
var formatDateRelative = (value, options = {}, _now = void 0) => {
  const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
  const date = toDate(value, epochUnit);
  const now = toDate(_now, epochUnit) ?? /* @__PURE__ */ new Date();
  if (isDate(date) && isDate(now)) {
    const locale = resolveLocale(options.locale);
    const formatOptions = options.formatOptions ?? {};
    const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1e3);
    const absDiff = Math.abs(diffInSeconds);
    let unit;
    if (options.unit) {
      unit = options.unit;
    } else if (absDiff < MINUTE) {
      unit = "second";
    } else if (absDiff < HOUR) {
      unit = "minute";
    } else if (absDiff < DAY) {
      unit = "hour";
    } else if (absDiff < 2 * WEEK) {
      unit = "day";
    } else if (absDiff < 2 * MONTH) {
      unit = "week";
    } else if (absDiff < YEAR) {
      unit = "month";
    } else {
      unit = "year";
    }
    const resolvedDiffInSeconds = absDiff > DAY ? Math.round(
      (startOfDay(date).getTime() - startOfDay(now).getTime()) / 1e3
    ) : diffInSeconds;
    const diffInUnits = convertToUnit(resolvedDiffInSeconds, unit);
    const dateRelativeFormatter = fetchRelativeFormatter(locale, formatOptions);
    return dateRelativeFormatter.format(diffInUnits, unit);
  } else {
    return null;
  }
};
export {
  FormatDatePreset,
  formatDate,
  formatDateRange,
  formatDateRelative,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS
};
//# sourceMappingURL=index.js.map