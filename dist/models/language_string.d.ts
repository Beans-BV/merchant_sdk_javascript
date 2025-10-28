/**
 * A specialized class for handling multi-language strings.
 *
 * This class provides type safety and convenience methods for working with
 * localized content where keys are language codes (e.g., 'en', 'vn')
 * and values are the translated strings.
 */
export declare class LanguageString {
    private readonly _map;
    /**
     * Creates an empty LanguageString with required 'en' language.
     */
    constructor(initialMap?: Record<string, string>);
    /**
     * Creates a LanguageString from an existing map.
     */
    static from(map: Record<string, string>): LanguageString;
    /**
     * Creates a LanguageString from a JSON object.
     */
    static fromJson(json: Record<string, any>): LanguageString;
    /**
     * Creates a LanguageString from a JSON string.
     */
    static fromJsonString(jsonString: string): LanguageString;
    /**
     * Gets a value by language code.
     */
    get(languageCode: string): string | undefined;
    /**
     * Sets a value for a language code.
     */
    set(languageCode: string, value: string): void;
    /**
     * Checks if a language code exists.
     */
    has(languageCode: string): boolean;
    /**
     * Gets all language codes.
     */
    keys(): string[];
    /**
     * Gets all values.
     */
    values(): string[];
    /**
     * Gets all entries as key-value pairs.
     */
    entries(): [string, string][];
    /**
     * Converts the LanguageString to a plain object.
     */
    toJson(): Record<string, string>;
    /**
     * Converts the LanguageString to a JSON string.
     */
    toJsonString(): string;
    /**
     * Gets the size of the language map.
     */
    get size(): number;
    /**
     * Iterates over the language map.
     */
    [Symbol.iterator](): Iterator<[string, string]>;
    /**
     * Converts to a plain object for compatibility.
     */
    toObject(): Record<string, string>;
}
//# sourceMappingURL=language_string.d.ts.map