"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FormatDatePreset: () => FormatDatePreset,
  formatDate: () => formatDate,
  formatDateRange: () => formatDateRange,
  formatDateRelative: () => formatDateRelative,
  formatDateYYYYMMDD: () => formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS: () => formatDateYYYYMMDDTHHMMSS
});
module.exports = __toCommonJS(index_exports);
var import_to_date = require("@chriscdn/to-date");
var import_memoize2 = require("@chriscdn/memoize");

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
var import_memoize = require("@chriscdn/memoize");
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
var fetchFormatter = (0, import_memoize.Memoize)(
  (locale, formatOptions) => new Intl.DateTimeFormat(locale, formatOptions),
  { maxSize: 20 }
);
var fetchRelativeFormatter = (0, import_memoize.Memoize)(
  (locale, formatOptions) => new Intl.RelativeTimeFormat(locale, formatOptions),
  { maxSize: 20 }
);
var resolveLocale = (locale) => locale?.replace("_", "-");

// src/index.ts
var formatDate = (0, import_memoize2.Memoize)(
  (value, options = {}) => {
    const epochUnit = options.epochUnit ?? import_to_date.EpochUnit.BESTGUESS;
    const date = (0, import_to_date.toDate)(value, epochUnit);
    if ((0, import_to_date.isDate)(date)) {
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
var formatDateYYYYMMDD = (0, import_memoize2.Memoize)(
  (value, timeZone) => {
    const date = (0, import_to_date.toDate)(value);
    if ((0, import_to_date.isDate)(date)) {
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
var formatDateYYYYMMDDTHHMMSS = (0, import_memoize2.Memoize)(
  (value, timeZone) => {
    const date = (0, import_to_date.toDate)(value);
    if ((0, import_to_date.isDate)(date)) {
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
var formatDateRange = (0, import_memoize2.Memoize)(
  (start, end, options = {}) => {
    const epochUnit = options.epochUnit ?? import_to_date.EpochUnit.BESTGUESS;
    const startDate = (0, import_to_date.toDate)(start, epochUnit);
    const endDate = (0, import_to_date.toDate)(end, epochUnit);
    if ((0, import_to_date.isDate)(startDate) && (0, import_to_date.isDate)(endDate)) {
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
  const epochUnit = options.epochUnit ?? import_to_date.EpochUnit.BESTGUESS;
  const date = (0, import_to_date.toDate)(value, epochUnit);
  const now = (0, import_to_date.toDate)(_now, epochUnit) ?? /* @__PURE__ */ new Date();
  if ((0, import_to_date.isDate)(date) && (0, import_to_date.isDate)(now)) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FormatDatePreset,
  formatDate,
  formatDateRange,
  formatDateRelative,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS
});
//# sourceMappingURL=index.cjs.map