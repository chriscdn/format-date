export declare enum FormatDatePreset {
    None = 0,
    DateTime = 1,
    DateTimeShort = 2,
    Date = 3,
    DateMedium = 4,
    DateShort = 5
}
export declare const fetchPreset: (preset: FormatDatePreset, locale: string) => Intl.DateTimeFormatOptions;
