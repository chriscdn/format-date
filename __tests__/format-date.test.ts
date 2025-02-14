import { describe, expect, test, it } from "vitest";
import {
  formatDate,
  FormatDatePreset,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS,
  formatDateRelative,
  formatDateRange,
} from "../src";
import { toDate, toDateUTC } from "@chriscdn/to-date";

describe("Date Formatting of numbers", () => {
  const inSeconds = 1732565892;
  const locale = "en-CA";
  const preset = FormatDatePreset.Date;
  const toBe = "November 25, 2024";

  it("Seconds", () => {
    expect(
      formatDate(inSeconds, {
        preset,
        locale,
      }),
    ).toBe(toBe);
  });

  it("Milliseconds", () => {
    expect(
      formatDate(inSeconds * 1e3, {
        preset,
        locale,
      }),
    ).toBe(toBe);
  });

  it("Microseconds", () => {
    expect(
      formatDate(inSeconds * 1e6, {
        preset,
        locale,
      }),
    ).toBe(toBe);
  });
});

describe("Date Time Formatting of strings", () => {
  it("Format String Test 1", () => {
    expect(
      formatDate("2025-02-11T15:00:00", {
        preset: FormatDatePreset.DateTime,
        locale: "en-GB",
      }),
    ).toBe("11 February 2025 at 15:00");
  });

  it("Format String Test 2", () => {
    expect(
      formatDate("2025-02-11T15:00:00", {
        preset: FormatDatePreset.DateTimeShort,
        locale: "en-GB",
      }),
    ).toBe("11/02/2025, 15:00");
  });
});

describe("Date Ranges", () => {
  // omitting the time means UTC
  const start = toDate("2025-02-09");
  const end = toDate("2025-02-13");
  const toBe = "February 9 – 13, 2025";

  const locale = "en";

  it("Date Range", () => {
    expect(formatDateRange(start, end, { locale })).toBe(toBe);
  });

  it("Date Range with milliseconds", () => {
    expect(formatDateRange(start!.getTime(), end!.getTime(), { locale })).toBe(
      toBe,
    );
  });

  it("Date Range with seconds", () => {
    expect(
      formatDateRange(start!.getTime() / 1000, end!.getTime() / 1000, {
        locale,
      }),
    ).toBe(toBe);
  });
});

describe("Date Relative", () => {
  const locale = "en-CA";

  it("In one day", () => {
    expect(
      formatDateRelative(
        "2025-02-12T15:00:00",
        { locale },
        "2025-02-11T15:00:00",
      ),
    ).toBe("in 1 day");
  });

  it("In one hour", () => {
    expect(
      formatDateRelative(
        "2025-02-11T16:00:00",
        { locale },
        "2025-02-11T15:00:00",
      ),
    ).toBe("in 1 hour");
  });

  it("In 59 minutes", () => {
    expect(
      formatDateRelative(
        "2025-02-11T15:59:00",
        { locale },
        "2025-02-11T15:00:00",
      ),
    ).toBe("in 59 minutes");
  });

  it("In 5 days", () => {
    expect(
      formatDateRelative(
        "2025-02-16T15:00:00",
        { locale },
        "2025-02-11T15:00:00",
      ),
    ).toBe("in 5 days");
  });

  it("In 5 days (calendar days)", () => {
    // We want to calculate calendar days such that a start or end date at
    // opposite times don't resolve to one less or more days.
    expect(
      formatDateRelative(
        "2025-02-16T23:00:00",
        { locale },
        "2025-02-11T01:00:00",
      ),
    ).toBe("in 5 days");
  });

  it("In 13 days", () => {
    expect(
      formatDateRelative(
        "2025-02-16T15:00:00",
        { locale },
        "2025-02-03T15:00:00",
      ),
    ).toBe("in 13 days");
  });

  it("In 2 weeks", () => {
    expect(
      formatDateRelative(
        "2025-02-16T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 2 weeks");
  });

  it("In 3 weeks", () => {
    expect(
      formatDateRelative(
        "2025-02-21T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 3 weeks");
  });

  it("In 6 weeks", () => {
    expect(
      formatDateRelative(
        "2025-03-15T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 6 weeks");
  });

  it("In 2 months", () => {
    expect(
      formatDateRelative(
        "2025-04-15T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 2 months");
  });

  it("In 24 months", () => {
    expect(
      formatDateRelative(
        "2027-02-15T15:00:00",
        { locale, unit: "months" },
        "2025-02-14T15:00:00",
      ),
    ).toBe("in 24 months");
  });

  it("In 11 months", () => {
    expect(
      formatDateRelative(
        "2026-01-01T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 11 months");
  });

  it("In 1 year", () => {
    expect(
      formatDateRelative(
        "2026-02-01T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 1 year");
  });

  it("In 1 year", () => {
    expect(
      formatDateRelative(
        "2026-07-01T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 1.4 years");
  });

  it("In 2 years", () => {
    expect(
      formatDateRelative(
        "2027-02-01T15:00:00",
        { locale },
        "2025-02-01T15:00:00",
      ),
    ).toBe("in 2 years");
  });

  // it("In 1 week", () => {
  //   // We want to calculate calendar days such that a start or end date at
  //   // opposite times don't resolve to one less or more days.
  //   expect(
  //     formatDateRelative(
  //       "2025-02-12T23:00:00",
  //       { locale },
  //       "2025-02-05T01:00:00",
  //     ),
  //   ).toBe("in 1 week");
  // });
});

describe("YYYY-MM-DD", () => {
  it("Simple 1", () => {
    expect(formatDateYYYYMMDD(toDateUTC("2025-02-12"))).toBe("2025-02-12");
  });
  it("Simple 2", () => {
    expect(formatDateYYYYMMDD("2025-02-12T00:00:00Z")).toBe("2025-02-12");
  });
  it("Simple 3 - Edge Case", () => {
    // This test depends on the time zone of the device running the test
    expect(formatDateYYYYMMDD("2025-02-12T00:00:00", "UTC")).toBe("2025-02-11");
  });
});

describe("YYYY-MM-DDTHH:MM:SS", () => {
  it("Simple 1", () => {
    expect(formatDateYYYYMMDDTHHMMSS("2025-02-12", "UTC")).toBe(
      "2025-02-12T00:00:00",
    );
  });
  it("Simple 2", () => {
    expect(formatDateYYYYMMDDTHHMMSS("2025-02-12T15:00:00")).toBe(
      "2025-02-12T15:00:00",
    );
  });
});

// it("", () => {
//   expect(
//     formatDate(1732565892000, {
//       preset: FormatDatePreset.None,
//       epochUnit: EpochUnit.BESTGUESS,
//       locale: "en-CA",
//     }),
//   ).toBe("2024-11-25");

//   expect(
//     formatDate(1732565892000000, {
//       preset: FormatDatePreset.None,
//       locale: "en-CA",
//     }),
//   ).toBe("2024-11-25");

//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.None,
//       locale: "en-CA",
//     }),
//   ).toBe("2024-11-25");

//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.DateTime,
//       locale: "en-CA",
//     }),
//   ).toBe("25 November 2024 at 15:00");

//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.DateTime,
//       locale: "en-US",
//     }),
//   ).toBe("November 25, 2024 at 3:00 PM");

//   expect(formatDate(sampleDate, { locale: "fr" })).toBe(
//     "25 novembre 2024 à 15:00",
//   );

//   expect(
//     formatDate(sampleDate, { preset: FormatDatePreset.DateTimeShort }),
//   ).toBe("25/11/2024, 15:00");

//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.DateTimeShort,
//       locale: "en-US",
//     }),
//   ).toBe("11/25/24, 3:00 PM");

//   expect(formatDate(sampleDate, { preset: FormatDatePreset.Date })).toBe(
//     "25 November 2024",
//   );

//   expect(
//     formatDate(sampleDate, { preset: FormatDatePreset.DateMedium }),
//   ).toBe("25 Nov 2024");

//   expect(formatDate(sampleDate, { preset: FormatDatePreset.DateShort })).toBe(
//     "25/11/2024",
//   );

//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.DateShort,
//       // formatOptions: { weekday: "long" },
//     }),
//   ).toBe("25/11/2024");
// });

// test("12 Hours - en-US", () => {
//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.DateTime,
//       locale: "en-US",
//     }),
//   ).toBe("November 25, 2024 at 3:00 PM");
// });
// test("12 Hours - en-CA", () => {
//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.DateTime,
//       locale: "en-CA",
//     }),
//   ).toBe("November 25, 2024 at 3:00 p.m.");
// });

// test("24 Hours - de-CH", () => {
//   expect(
//     formatDate(sampleDate, {
//       preset: FormatDatePreset.DateTime,
//       locale: "de-CH",
//     }),
//   ).toBe("25. November 2024 um 15:00");
// });

// it("formatDateYYYYMMDD", () => {
//   expect(formatDateYYYYMMDD("2024-11-25T01:00:00")).toBe("2024-11-25");
// });

// test("formatDateYYYYMMDDTHHMMSS", () => {
//   expect(formatDateYYYYMMDDTHHMMSS("2024-11-25T01:00:00")).toBe(
//     "2024-11-25T01:00:00",
//   );
// });

// describe("Relative", () => {
//   test("0 Seconds", () => {
//     expect(
//       formatDateRelative(
//         "2026-02-07",
//         {
//           unit: "second",
//         },
//         "2026-02-07",
//       ),
//     ).toBe("in 0 seconds");
//   });

//   test("Seconds", () => {
//     expect(
//       formatDateRelative(
//         "2026-02-06",
//         {
//           unit: "second",
//         },
//         "2026-02-07",
//       ),
//     ).toBe("86,400 seconds ago");
//   });

//   test("Day minus 1", () => {
//     expect(
//       formatDateRelative(
//         "2026-02-05T23:00:00",
//         {
//           unit: "days",
//         },
//         "2026-02-06T03:00:00",
//       ),
//     ).toBe("0 days ago");
//   });

//   test("Day", () => {
//     expect(
//       formatDateRelative(
//         "2026-02-11T15:00:00",
//         {
//           unit: "days",
//         },
//         "2026-02-10T16:00:00",
//       ),
//     ).toBe("in 1 day");
//   });

//   test("Day", () => {
//     expect(
//       formatDateRelative(
//         "2025-02-12",
//         {
//           unit: "days",
//         },
//         "2025-02-10T00:00:00",
//       ),
//     ).toBe("in 2 days");
//   });
// });

// describe("Range", () => {
//   test("Range1", () => {
//     expect(
//       formatDateRange("2025-01-01", "2029-01-08T08:00:00", {
//         locale: "fr",
//       }),
//     ).toBe("1 janvier 2025 – 8 janvier 2029");
//   });
// });

// describe("Range", () => {
//   test("adfadf ", () => {
//     expect(
//       formatDateRelative(
//         "2025-02-12T01:00:00",
//         { formatOptions: { numeric: "auto" } },
//         "2025-02-11T23:00:00",
//       ),
//     ).toBe("in 1 day");
//   });
// });

// console.log(formatDateRelative("2025-02-13"));
