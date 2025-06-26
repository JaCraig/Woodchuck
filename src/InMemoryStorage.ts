/**
 * InMemoryStorage is an in-memory implementation of the Storage interface.
 *
 * This class is used as a fallback for environments where localStorage is not available (such as Node.js).
 * All data is stored as string key-value pairs in memory and is lost when the process exits or the instance is cleared.
 *
 * Example usage:
 *   const storage = new InMemoryStorage();
 *   storage.setItem('key', 'value');
 *   const value = storage.getItem('key');
 */
export class InMemoryStorage implements Storage {
  /**
   * Internal store for key-value pairs.
   */
  private store: Record<string, string> = {};

  /**
   * Returns the number of stored items.
   */
  get length(): number {
    return Object.keys(this.store).length;
  }

  /**
   * Removes all key-value pairs from the storage.
   */
  clear(): void {
    this.store = {};
  }

  /**
   * Returns the value associated with the given key, or null if not found.
   * @param key The key whose value to retrieve.
   * @returns The value as a string, or null if not found.
   */
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  /**
   * Returns the key at the specified index, or null if the index is out of bounds.
   * @param index The index of the key to retrieve.
   * @returns The key as a string, or null if not found.
   */
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  /**
   * Removes the key and its value from the storage.
   * @param key The key to remove.
   */
  removeItem(key: string): void {
    delete this.store[key];
  }

  /**
   * Sets the value for the given key in the storage.
   * @param key The key to set.
   * @param value The value to associate with the key.
   */
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}
