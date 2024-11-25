# @chriscdn/format-date

## Overview

This package simplifies converting a date representation (such as a `number`, `string`, or `Date`) into a formatted date string. It uses [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for formatting.

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

### Formatting a Date

```ts
import { formatDate } from "@chriscdn/format-date";

const formattedDate = formatDate("2024-11-25T15:00:00");
// Output: November 25, 2024 at 15:00
```

The first argument can be a `string`, `number`, or `Date`. These are converted to a `Date` object with [@chriscdn/to-date](https://www.npmjs.com/package/@chriscdn/to-date) before formating with [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat). A `null` is returned if parsing fails.

### Configuration Options

The `formatDate` function accepts a second parameter with options. All options are optional:

```ts
import { formatDate, FormatDatePreset } from "@chriscdn/format-date";

const options = {
  locale: "en-GB", // the language/region format for formatting
  preset: FormatDatePreset.DateTime, // a predefined format
  epochUnit: EpochUnit.BESTGUESS, // the units when parsing numbers
  formatOptions: {}, // additional formatting options for Intl.DateTimeFormat
};

const formattedDate = formatDate(sampleDate, options);
```

#### **Option Details**

- **`locale`**: Specify the desired locale (e.g., `en`, `de`, `en-US`, `en-CA`). Hyphenated locales are preferred, but underscores (e.g., `en_CA`) will be automatically converted to hyphens (e.g., `en-CA`). If omitted, the package will attempt to determine the locale from your browser. If this fails for any reason, then `en-GB` is used.

- **`preset`**: An opinionated formatting preset:

  - `FormatDatePreset.None`
  - `FormatDatePreset.DateTime` (default)
  - `FormatDatePreset.DateTimeShort`
  - `FormatDatePreset.Date`
  - `FormatDatePreset.DateMedium`
  - `FormatDatePreset.DateShort`

- **`formatOptions`**: Additional options for `Intl.DateTimeFormat`, which are merged with the selected preset.

## Examples

```ts
const formattedDate = formatDate(1732571243, { locale: "fr" });
// Output: 25 novembre 2024 à 15:00
```

## License

[MIT](LICENSE)
