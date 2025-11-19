import { Eventing } from './Eventing';
import { ApiSync, HasId } from './ApiSync';

export class Collection<T extends HasId, U> {
  models: U[] = [];
  events: Eventing = new Eventing();
  apiSync: ApiSync<T> = new ApiSync<T>('http://localhost:3000');

  constructor(
    url: string,
    public des: (json: T) => U
  ) {
    this.apiSync = new ApiSync<T>(url);
  }

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  async fetch(): Promise<void> {
    const response = await this.apiSync.fetchAll();

    response.data.forEach((value: T) => {
      this.models.push(this.des(value));
    });
  }
}
