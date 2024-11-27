export enum FormatDatePreset {
    None,
    DateTime,
    DateTimeShort,
    Date,
    DateMedium,
    DateShort,
}

export const fetchPreset = (
    preset: FormatDatePreset,
    locale: string,
): Intl.DateTimeFormatOptions => {
    switch (preset) {
        case FormatDatePreset.None:
            return {};
        case FormatDatePreset.DateTime:
            // "November 25, 2024 at 15:00"
            // "November 25, 2024 at 3:00 PM"
            return {
                // weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            };
        case FormatDatePreset.DateTimeShort:
            // "11/25/24, 15:00"
            // "11/25/24, 3:00 PM"
            return {
                dateStyle: "short",
                timeStyle: "short",
            };

        case FormatDatePreset.Date:
            // "November 25, 2024"
            return {
                // dateStyle: "long",
                year: "numeric",
                month: "long",
                day: "2-digit",
            };
        case FormatDatePreset.DateMedium:
            // "Nov 25, 2024"
            return {
                // dateStyle: "medium",
                year: "numeric",
                month: "short",
                day: "2-digit",
            };
        case FormatDatePreset.DateShort:
            // "11/25/24"
            return {
                // dateStyle: "short",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            };
        default:
            return {
                dateStyle: "full",
            };
    }
};
