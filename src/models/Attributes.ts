export class Attributes<T extends object> {
  constructor(private data: T) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  set(update: Partial<T>): void {
    Object.assign(this.data, update);
  }
}
