import { describe, expect, it, test } from "vitest";
import {
  formatDate,
  FormatDatePreset,
  formatDateRange,
  formatDateRelative,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDTHHMMSS,
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
  const start = toDate("2025-02-09")!;
  const end = toDate("2025-02-13")!;
  const toBe = "February 9 – 13, 2025";

  const locale = "en";

  it("Date Range", () => {
    expect(formatDateRange(start, end, { locale })).toBe(toBe);
  });

  it("Date Range with milliseconds", () => {
    expect(formatDateRange(start.getTime(), end.getTime(), { locale })).toBe(
      toBe,
    );
  });

  it("Date Range with seconds", () => {
    expect(
      formatDateRange(start.getTime() / 1000, end.getTime() / 1000, {
        locale,
      }),
    ).toBe(toBe);
  });

  it("Same Day", () => {
    expect(
      formatDateRange("2025-02-11", "2025-02-11", {
        locale,
      }),
    ).toBe("February 11, 2025");
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
  it("Toronto", () => {
    expect(formatDateYYYYMMDD("2025-02-12", "America/Toronto")).toBe(
      "2025-02-11",
    );
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

describe("Caching", () => {
  const d11 = toDate("2025-03-11T15:00:00");
  const d12 = toDate("2025-03-12T15:00:00");

  it("Cache 11", () => {
    expect(formatDate(d11, { locale: "en-GB" })).toBe("11 March 2025 at 15:00");
  });

  it("Cache 12", () => {
    expect(formatDate(d12, { locale: "en-GB" })).toBe("12 March 2025 at 15:00");
  });
});

describe("Edge Cases", () => {
  const d = toDateUTC("0002-02-01");
  const dformatted = formatDateYYYYMMDD(d, "UTC");

  it("Edge Case 1", () => {
    expect(dformatted).toBe("0002-02-01");
  });

  it("EdgeCAse2", () => {
    const pDate = toDateUTC(dformatted);
    const pdDate = formatDateYYYYMMDD(pDate, "UTC");
    expect(pdDate).toBe("0002-02-01");
  });
});
