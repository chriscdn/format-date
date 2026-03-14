// src/index.ts
import { EpochUnit, isDate, toDate, toDateOrThrow } from "@chriscdn/to-date";
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
var TimeInSeconds = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
  WEEK: 7 * 24 * 60 * 60,
  YEAR: 365 * 24 * 60 * 60,
  // approximate
  MONTH: 365 * 24 * 60 * 60 / 12,
  // approximate
  QUARTER: 365 * 24 * 60 * 60 / 4
  // approximate
};
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
      return _round(seconds / TimeInSeconds.YEAR, 1);
    case "quarter":
    case "quarters":
      return Math.round(seconds / TimeInSeconds.QUARTER);
    case "month":
    case "months":
      return Math.round(seconds / TimeInSeconds.MONTH);
    case "week":
    case "weeks":
      return Math.round(seconds / TimeInSeconds.WEEK);
    case "day":
    case "days":
      return Math.round(seconds / TimeInSeconds.DAY);
    case "hour":
    case "hours":
      return Math.round(seconds / TimeInSeconds.HOUR);
    case "minute":
    case "minutes":
      return Math.round(seconds / TimeInSeconds.MINUTE);
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
var formatDateRelative = (value, options = {}) => {
  const epochUnit = options.epochUnit ?? EpochUnit.BESTGUESS;
  const date = toDate(value, epochUnit);
  const relativeTo = options.relativeTo ? toDateOrThrow(options.relativeTo, epochUnit) : /* @__PURE__ */ new Date();
  if (isDate(date) && isDate(relativeTo)) {
    const locale = resolveLocale(options.locale);
    const formatOptions = options.formatOptions ?? {};
    const diffInSeconds = Math.round(
      (date.getTime() - relativeTo.getTime()) / 1e3
    );
    const absDiff = Math.abs(diffInSeconds);
    let unit;
    if (options.unit) {
      unit = options.unit;
    } else if (absDiff < TimeInSeconds.MINUTE) {
      unit = "second";
    } else if (absDiff < TimeInSeconds.HOUR) {
      unit = "minute";
    } else if (absDiff < TimeInSeconds.DAY) {
      unit = "hour";
    } else if (absDiff < 2 * TimeInSeconds.WEEK) {
      unit = "day";
    } else if (absDiff < 2 * TimeInSeconds.MONTH) {
      unit = "week";
    } else if (absDiff < TimeInSeconds.YEAR) {
      unit = "month";
    } else {
      unit = "year";
    }
    const resolvedDiffInSeconds = absDiff > TimeInSeconds.DAY ? Math.round(
      (startOfDay(date).getTime() - startOfDay(relativeTo).getTime()) / 1e3
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