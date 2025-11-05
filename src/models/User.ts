import { Model } from './Model';
import { ApiSync } from './ApiSync';
import { Attributes } from './Attributes';
import { Eventing } from './Eventing';

export interface IUser {
  id?: string;
  name?: string;
  age?: number;
}

export class User extends Model<IUser> {

    static build(user: IUser): User {
      return new User (
        new Attributes<IUser>(user),
        new  Eventing(),
        new  ApiSync<IUser>('http://localhost:3000/users'),

      );
    }
}

/*export class User {
  events: Eventing = new Eventing();
  sync: Sync<IUser> = new Sync<IUser>('http://localhost:3000/users');
  attr: Attributes<IUser>;

  constructor(private data: IUser) {
    this.attr = new Attributes<IUser>(this.data);
  }

  get(prop: keyof IUser): IUser[keyof IUser] {
    return this.attr.get(prop);
  }

  set(prop: IUser): void {
    this.attr.set(prop);
  }

  on(eventName: string, callback: Callback): void {
    this.events.on(eventName, callback);
  }

  trigger(eventName: string): void {
    this.events.trigger(eventName);
  }

  async fetch(): Promise<void> {
     const res = await this.sync.fetch(this.data.id as string);
     this.attr.set(res.data);
  }

  async save(): Promise<void> {
    const res = await this.sync.save(this.data);
    this.attr.set(res.data);
  }
}*/
