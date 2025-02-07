import { describe, expect, test } from "vitest";
import {
  formatDate,
  FormatDatePreset,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS,
  formatDateRelative,
  formatDateRange,
} from "../src";
import { EpochUnit, toDate } from "@chriscdn/to-date";

const sampleDate = toDate("2024-11-25T15:00:00");

describe("Test Group 1", () => {
  test("Date Time Formatting", () => {
    expect(
      formatDate(1732565892, {
        preset: FormatDatePreset.None,
        epochUnit: EpochUnit.SECONDS,
      }),
    ).toBe("25/11/2024");
    expect(
      formatDate(1732565892000, {
        preset: FormatDatePreset.None,
        epochUnit: EpochUnit.BESTGUESS,
      }),
    ).toBe("25/11/2024");

    expect(
      formatDate(1732565892000000, { preset: FormatDatePreset.None }),
    ).toBe("25/11/2024");

    expect(formatDate(sampleDate, { preset: FormatDatePreset.None })).toBe(
      "25/11/2024",
    );

    expect(formatDate(sampleDate, { preset: FormatDatePreset.DateTime })).toBe(
      "25 November 2024 at 15:00",
    );

    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateTime,
        locale: "en-US",
      }),
    ).toBe("November 25, 2024 at 3:00 PM");

    expect(formatDate(sampleDate, { locale: "fr" })).toBe(
      "25 novembre 2024 à 15:00",
    );

    expect(
      formatDate(sampleDate, { preset: FormatDatePreset.DateTimeShort }),
    ).toBe("25/11/2024, 15:00");

    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateTimeShort,
        locale: "en-US",
      }),
    ).toBe("11/25/24, 3:00 PM");
  });
});

describe("Test Group 2", () => {
  test("Date Formatting", () => {
    expect(formatDate(sampleDate, { preset: FormatDatePreset.Date })).toBe(
      "25 November 2024",
    );

    expect(
      formatDate(sampleDate, { preset: FormatDatePreset.DateMedium }),
    ).toBe("25 Nov 2024");

    expect(formatDate(sampleDate, { preset: FormatDatePreset.DateShort })).toBe(
      "25/11/2024",
    );

    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateShort,
        // formatOptions: { weekday: "long" },
      }),
    ).toBe("25/11/2024");
  });
});

describe("12 Hours", () => {
  test("12 Hours - en-US", () => {
    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateTime,
        locale: "en-US",
      }),
    ).toBe("November 25, 2024 at 3:00 PM");
  });
  test("12 Hours - en-CA", () => {
    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateTime,
        locale: "en-CA",
      }),
    ).toBe("November 25, 2024 at 3:00 p.m.");
  });

  test("24 Hours - de-CH", () => {
    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateTime,
        locale: "de-CH",
      }),
    ).toBe("25. November 2024 um 15:00");
  });

  test("formatDateYYYYMMDD", () => {
    expect(formatDateYYYYMMDD("2024-11-25T01:00:00")).toBe("2024-11-25");
  });

  test("formatDateYYYYMMDDTHHMMSS", () => {
    expect(formatDateYYYYMMDDTHHMMSS("2024-11-25T01:00:00")).toBe(
      "2024-11-25T01:00:00",
    );
  });
});

describe("Relative", () => {
  test("0 Seconds", () => {
    expect(
      formatDateRelative(
        "2026-02-07",
        {
          unit: "second",
        },
        "2026-02-07",
      ),
    ).toBe("in 0 seconds");
  });

  test("Seconds", () => {
    expect(
      formatDateRelative(
        "2026-02-06",
        {
          unit: "second",
        },
        "2026-02-07",
      ),
    ).toBe("86,400 seconds ago");
  });

  test("Day minus 1", () => {
    expect(
      formatDateRelative(
        "2026-02-05T23:00:00",
        {
          unit: "days",
        },
        "2026-02-06T03:00:00",
      ),
    ).toBe("0 days ago");
  });
});

describe("Range", () => {
  test("Range1", () => {
    expect(
      formatDateRange("2025-01-01", "2029-01-08T08:00:00", {
        locale: "fr",
      }),
    ).toBe("1 janvier 2025 – 8 janvier 2029");
  });
});
