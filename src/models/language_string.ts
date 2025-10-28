/**
 * A specialized class for handling multi-language strings.
 * 
 * This class provides type safety and convenience methods for working with 
 * localized content where keys are language codes (e.g., 'en', 'vn')
 * and values are the translated strings.
 */
export class LanguageString {
  private readonly _map: Map<string, string>;

  /**
   * Creates an empty LanguageString with required 'en' language.
   */
  constructor(initialMap: Record<string, string> = { en: '' }) {
    this._map = new Map(Object.entries(initialMap));
    
    if (!this._map.has('en')) {
      throw new Error('English language (en) is required');
    }
  }

  /**
   * Creates a LanguageString from an existing map.
   */
  static from(map: Record<string, string>): LanguageString {
    return new LanguageString(map);
  }

  /**
   * Creates a LanguageString from a JSON object.
   */
  static fromJson(json: Record<string, any>): LanguageString {
    const map: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(json)) {
      if (typeof value !== 'string') {
        throw new Error(`All values must be strings, got ${typeof value} for key "${key}"`);
      }
      map[key] = value;
    }

    if (!map.hasOwnProperty('en')) {
      throw new Error('English language (en) is required');
    }

    return new LanguageString(map);
  }

  /**
   * Creates a LanguageString from a JSON string.
   */
  static fromJsonString(jsonString: string): LanguageString {
    const json = JSON.parse(jsonString) as Record<string, any>;
    return LanguageString.fromJson(json);
  }

  /**
   * Gets a value by language code.
   */
  get(languageCode: string): string | undefined {
    return this._map.get(languageCode);
  }

  /**
   * Sets a value for a language code.
   */
  set(languageCode: string, value: string): void {
    this._map.set(languageCode, value);
  }

  /**
   * Checks if a language code exists.
   */
  has(languageCode: string): boolean {
    return this._map.has(languageCode);
  }

  /**
   * Gets all language codes.
   */
  keys(): string[] {
    return Array.from(this._map.keys());
  }

  /**
   * Gets all values.
   */
  values(): string[] {
    return Array.from(this._map.values());
  }

  /**
   * Gets all entries as key-value pairs.
   */
  entries(): [string, string][] {
    return Array.from(this._map.entries());
  }

  /**
   * Converts the LanguageString to a plain object.
   */
  toJson(): Record<string, string> {
    return Object.fromEntries(this._map);
  }

  /**
   * Converts the LanguageString to a JSON string.
   */
  toJsonString(): string {
    return JSON.stringify(this.toJson());
  }

  /**
   * Gets the size of the language map.
   */
  get size(): number {
    return this._map.size;
  }

  /**
   * Iterates over the language map.
   */
  [Symbol.iterator](): Iterator<[string, string]> {
    return this._map[Symbol.iterator]();
  }

  /**
   * Converts to a plain object for compatibility.
   */
  toObject(): Record<string, string> {
    return this.toJson();
  }
}
