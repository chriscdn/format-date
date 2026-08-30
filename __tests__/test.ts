import { toDate, toDateOrThrow } from "@chriscdn/to-date";

const fomatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  year: "numeric",
});

const d1 = toDateOrThrow("2024-05-03");
const d2 = toDateOrThrow("2026-05-03");

const z = fomatter.formatRange(d1, d2);

console.log(z);
