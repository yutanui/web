import axios from "axios";


export interface IUser {
    id?: string;
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

    async save() : Promise<void> {
        const { id } = this.data;
        if (id) {
            await axios.put(`http://localhost:3000/users/${id}`, this.data).then((response) => {
            }).catch((error) => {
                console.error("Error updating user:", error);
            });
        } else {
            await axios.post(`http://localhost:3000/users`, this.data).then((response) => {
                this.set(response.data);
            }).catch((error) => {
                console.error("Error creating user:", error);
            });
        }
    }   
}