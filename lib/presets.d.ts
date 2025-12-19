export declare enum FormatDatePreset {
    None = 0,
    DateTime = 1,
    DateTimeMedium = 2,
    DateTimeShort = 3,
    Date = 4,
    DateMedium = 5,
    DateShort = 6
}
export declare const fetchPreset: (preset: FormatDatePreset) => Intl.DateTimeFormatOptions;
