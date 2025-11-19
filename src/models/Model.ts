import axios, { AxiosResponse } from 'axios';

interface HasId {
  id?: string;
}

interface ModelAttributes<T> {
  get<K extends keyof T>(key: K): T[K];
  set(update: Partial<T>): void;
  getAll(): T;
}

interface Sync<T extends HasId> {
  fetch(id: string): Promise<AxiosResponse>;
  save(data: T): Promise<AxiosResponse>;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  get(prop: keyof T): T[keyof T] {
    return this.attributes.get(prop);
  }

  set(prop: T): void {
    this.attributes.set(prop);
  }

  on(eventName: string, callback: () => void): void {
    this.events.on(eventName, callback);
  }

  trigger(eventName: string): void {
    this.events.trigger(eventName);
  }

  async fetch(): Promise<void> {
    const res = await this.sync.fetch(this.attributes.get('id') as string);
    this.attributes.set(res.data);
  }

  async save(): Promise<void> {
    const res = await this.sync.save(this.attributes.getAll());
    this.attributes.set(res.data);
  }
}
