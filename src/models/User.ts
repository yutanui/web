import axios from "axios";

export interface IUser {
    id?: number;
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

    async fetch() : Promise<void> {
        if (!this.data.id) {
            throw new Error("Cannot fetch without an id");
        }

        await axios.get(`http://localhost:3000/users/${this.data.id}`).then((response) => {
            this.set(response.data);
        }).catch((error) => {
            console.error("Error fetching user:", error);
        });
    }
}