
export interface IUser {
    name?: string;
    age?: number;
}

export class User {
    constructor(private data: IUser) {}

    get(prop : keyof IUser) : IUser[keyof IUser]  {
        return this.data[prop];

    }

    set(prop : IUser) : void {
        Object.assign(this.data, prop);
    }
}