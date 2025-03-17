# @chriscdn/format-date

## Overview

Convert and format dates, including date ranges and relative dates. This library helps with the common task of parsing dates and formatting them for display.

Built on `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`, it ensures accurate internationalization while using memoization for improved performance.

## Installation

Install via npm:

```bash
npm install @chriscdn/format-date
```

Or using yarn:

```bash
yarn add @chriscdn/format-date
```

## Usage

### Importing

```ts
import {
  formatDate,
  formatDateRange,
  formatDateRelative,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS,
} from "@chriscdn/format-date";
```

Each function accepts a date as a `string`, `number`, or `Date`.

When a `number` is provided, it can represent seconds, milliseconds, or microseconds since the epoch. The library determines the unit based on the number of digits, but allows explicit control using the `epochUnit` parameter.

When a `string` or `number` is provided, it is first converted into a `Date` instance before formatting. This means JavaScript's string parsing rules and time zone caveats apply. For details, see [Date time string format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format).

### Formatting a Date

By default, it uses the local system time zone.

```ts
const formattedDate = formatDate("2025-02-12T15:00:00");
// "February 12, 2025 at 3:00 PM" (assuming an English locale)
```

#### Options

The `formatDate` function accepts a second parameter with options. The following shows all options and their defaults. All options are optional:

```ts
import {
  formatDate,
  FormatDatePreset,
  type FormatDateOptions,
} from "@chriscdn/format-date";

import { EpochUnit } from "@chriscdn/to-date";

const options: FormatDateOptions = {
  locale: undefined,
  preset: FormatDatePreset.DateTime,
  epochUnit: EpochUnit.BESTGUESS,
  formatOptions: {},
};

const formattedDate = formatDate(sampleDate, options);
```

- **`locale`**: Specifies the desired locale (e.g., `en`, `de`, `en-US`, `en-CA`). Hyphenated locales are preferred, but underscores (e.g., `en_CA`) will be automatically converted to hyphens (e.g., `en-CA`). If `undefined`, the system locale is used.
- **`preset`**: An opinionated formatting preset:
  - `FormatDatePreset.None`
  - `FormatDatePreset.DateTime` (default)
  - `FormatDatePreset.DateTimeShort`
  - `FormatDatePreset.Date`
  - `FormatDatePreset.DateMedium`
  - `FormatDatePreset.DateShort`
- **`epochUnit`**: Determines how epoch values are interpreted when passing in a `number`:
  - `EpochUnit.BESTGUESS`
  - `EpochUnit.SECONDS`
  - `EpochUnit.MILLISECONDS`
  - `EpochUnit.MICROSECONDS`
- **`formatOptions`**: Additional options for the underlying `Intl.DateTimeFormat` constructor, which are merged with the selected preset. See the [DateTimeFormat parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) documentation for options.

### Formatting as YYYY-MM-DD

Format a date as `YYYY-MM-DD`. Example:

```ts
const formattedDate = formatDateYYYYMMDD("2025-02-12T00:00:00");
// "2025-02-12"
```

The second parameter allows specifying a time zone, which defaults to the system time zone if omitted or `undefined`:

```ts
const formattedDate = formatDateYYYYMMDD("2025-02-12", "America/Toronto");
// "2025-02-11"
```

### Formatting as YYYY-MM-DDTHH:MM:SS

Format a date as `YYYY-MM-DDTHH:MM:SS`. Example:

```ts
const formattedDate = formatDateYYYYMMDDTHHMMSS("2025-02-12T00:00:00");
// "2025-02-12T00:00:00"
```

The second parameter allows specifying a time zone, which defaults to the system time zone if omitted or `undefined`:

```ts
const formattedDate = formatDateYYYYMMDDTHHMMSS(
  "2025-02-12",
  "America/Toronto",
);
// "2025-02-11T19:00:00"
```

### Formatting a Date Range

Format a date range as a human-readable string.

```ts
import { formatDateRange } from "@chriscdn/format-date";

const formattedDateRange = formatDateRange("2025-02-01", "2025-02-15");
// "February 1 – 15, 2025"
```

#### Options

The `formatDateRange` function accepts a third parameter with options. The following shows all options and their defaults. All options are optional:

```ts
import {
  formatDateRange,
  type FormatDateRangeOptions,
} from "@chriscdn/format-date";

import { EpochUnit } from "@chriscdn/to-date";

const options: FormatDateRangeOptions = {
  locale: undefined,
  epochUnit: EpochUnit.BESTGUESS,
  formatOptions: {},
};

const formatted = formatDateRange(startDate, endDate, options);
```

- **`locale`**: Specifies the desired locale (e.g., `en`, `de`, `en-US`, `en-CA`). Hyphenated locales are preferred, but underscores (e.g., `en_CA`) will be automatically converted to hyphens (e.g., `en-CA`). If `undefined`, the system locale is used.
- **`epochUnit`**: Determines how epoch values are interpreted when passing in a `number`:
  - `EpochUnit.BESTGUESS`
  - `EpochUnit.SECONDS`
  - `EpochUnit.MILLISECONDS`
  - `EpochUnit.MICROSECONDS`
- **`formatOptions`**: Additional options for the underlying `Intl.DateTimeFormat` constructor. See the [DateTimeFormat parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) documentation for options.

### Formatting a Relative Date

Wraps `Intl.RelativeTimeFormat` to generate human-readable strings relative to the current date and time.

```ts
import { formatDateRelative } from "@chriscdn/format-date";

const formattedDateRelative = formatDateRelative("2024-11-25");
// "in 4 days" (assuming today is 2024-11-21)
```

The function calculates the duration from the current time to the target date and selects an appropriate unit, such as seconds, minutes, hours, days, weeks, months, or years, based on the duration size. A few notes:

- The resolution is opinionated. For example, a duration of "42 days" is interpreted as "6 weeks" and not "1 month."
- All units are rounded to zero significant digits, except for years, which are rounded to one significant digit (e.g., "in 1.5 years").
- Durations longer than a day are resolved as calendar days. For example, 26 hours becomes "in 2 days" (spanning _two calendar days_) instead of being rounded down to "in 1 day".

#### Options

The `formatDateRelative` function accepts a second parameter with options. The following shows all options and their defaults. All options are optional:

```ts
import {
  formatDateRelative,
  type FormatDateRelativeOptions,
} from "@chriscdn/format-date";

import { EpochUnit } from "@chriscdn/to-date";

const options: FormatDateRelativeOptions = {
  locale: undefined,
  unit: undefined,
  epochUnit: EpochUnit.BESTGUESS,
  formatOptions: {},
};

const formattedDate = formatDateRelative(sampleDate, options);
```

- **`locale`**: Specifies the desired locale (e.g., `en`, `de`, `en-US`, `en-CA`). Hyphenated locales are preferred, but underscores (e.g., `en_CA`) will be automatically converted to hyphens (e.g., `en-CA`). If `undefined`, the system locale is used.
- **`unit`**: Specifies the unit for the relative date display. For valid unit values, refer to [the unit documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/format#unit). If `undefined`, the function will automatically choose an appropriate unit based on the duration size.
- **`epochUnit`**: Determines how epoch values are interpreted when passing in a `number`:
  - `EpochUnit.BESTGUESS`
  - `EpochUnit.SECONDS`
  - `EpochUnit.MILLISECONDS`
  - `EpochUnit.MICROSECONDS`
- **`formatOptions`**: Additional options for the underlying `Intl.RelativeTimeFormat` constructor. See the [RelativeTimeFormat parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat#parameters) documentation for options.

## License

[MIT](LICENSE)
