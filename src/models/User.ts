
export interface IUser {
    name?: string;
    age?: number;
}

type Callback = () => void;

export class User {

    events : { [key : string] : Callback[] } = {};

    constructor(private data: IUser) {}

    get(prop : keyof IUser) : IUser[keyof IUser]  {
        return this.data[prop];

    }

    set(prop : IUser) : void {
        Object.assign(this.data, prop);
    }

    on(eventName: string, callback: Callback) : void {
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }

    trigger(eventName: string) : void {
        const handlers = this.events[eventName];
        if (!handlers || handlers.length === 0) {
            return;
        }
        handlers.forEach(callback => {
            callback();
        });
    }
}