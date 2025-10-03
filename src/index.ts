import { User } from "./models/User";


const user = new User({ name: "Yutthasit", age: 20 });

console.log(user.get("name"));
console.log(user.get("age"));


user.set({ age: 21 });

console.log(user.get("age"));