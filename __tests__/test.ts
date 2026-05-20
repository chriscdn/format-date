const localTime = "2026-01-01T23:30:00";
import { formatDateYYYYMMDDTHHMMSS } from "../src";
import { toDateUTC, toDate } from "@chriscdn/to-date";

const z = formatDateYYYYMMDDTHHMMSS(toDate(localTime), "UTC");

console.log(z);
