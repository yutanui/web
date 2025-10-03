import { User } from "./models/User";


const user = new User({ name: "Nui", age: 20 });

user.on("change", () => {
    console.log("Change event triggered");
});

user.on("change", () => {
    console.log("Change 2 event triggered");
});

user.on("save", () => {
    console.log("Save event triggered");
});

console.log(user);

user.trigger("change");