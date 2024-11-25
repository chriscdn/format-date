import { describe, expect, test } from "vitest";
import { formatDate, FormatDatePreset } from "../src";
import { EpochUnit, toDate } from "@chriscdn/to-date";

const sampleDate = toDate("2024-11-25T15:00:00");

describe("Test Group 1", () => {
  test("Date Time Formatting", () => {
    expect(
      formatDate(1732565892, {
        preset: FormatDatePreset.None,
        epochUnit: EpochUnit.SECONDS,
      }),
    ).toBe(
      "11/25/2024",
    );
    expect(
      formatDate(1732565892000, {
        preset: FormatDatePreset.None,
        epochUnit: EpochUnit.BESTGUESS,
      }),
    ).toBe(
      "11/25/2024",
    );

    expect(formatDate(1732565892000000, { preset: FormatDatePreset.None }))
      .toBe(
        "11/25/2024",
      );

    expect(formatDate(sampleDate, { preset: FormatDatePreset.None })).toBe(
      "11/25/2024",
    );

    expect(formatDate(sampleDate, { preset: FormatDatePreset.DateTime })).toBe(
      "November 25, 2024 at 15:00",
    );

    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateTime,
        locale: "en-US",
      }),
    )
      .toBe(
        "November 25, 2024 at 3:00 PM",
      );

    expect(formatDate(sampleDate, { locale: "fr" }))
      .toBe(
        "25 novembre 2024 à 15:00",
      );

    expect(formatDate(sampleDate, { preset: FormatDatePreset.DateTimeShort }))
      .toBe(
        "11/25/24, 15:00",
      );

    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateTimeShort,
        locale: "en-US",
      }),
    )
      .toBe(
        "11/25/24, 3:00 PM",
      );
  });
});

describe("Test Group 2", () => {
  test("Date Formatting", () => {
    expect(formatDate(sampleDate, { preset: FormatDatePreset.Date })).toBe(
      "November 25, 2024",
    );

    expect(formatDate(sampleDate, { preset: FormatDatePreset.DateMedium }))
      .toBe(
        "Nov 25, 2024",
      );

    expect(formatDate(sampleDate, { preset: FormatDatePreset.DateShort })).toBe(
      "11/25/2024",
    );

    expect(
      formatDate(sampleDate, {
        preset: FormatDatePreset.DateShort,
        // formatOptions: { weekday: "long" },
      }),
    ).toBe(
      "11/25/2024",
    );
  });
});
