import { User } from "./models/User";

const user = new User({ id: "1", name: "Nui", age: 20 });

/*
user.on("change", () => {
    console.log("Change event triggered");
});

user.on("save", () => {
    console.log("Save event triggered");
});

console.log(user);

user.trigger("change");
*/

//fetch user
const user2 = new User({id: "5784"});
user2.fetch().then(() => {
console.log(user2.get("name"));
console.log(user2.get("age"));
}).catch((err) => {
    console.error(err);
});


//save new user
const user3 = new User({ name: "Thee", age: 3 });
user3.save().then(() => {
    console.log(user3.get("id"));
}).catch((err) => {
    console.error(err);
});




