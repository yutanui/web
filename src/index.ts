/*import { User } from './models/User';

//const user = new User({ id: '1', name: 'Nui', age: 20 });


const user = User.build({ name: 'Nui', age: 20 });


user.on("change", () => {
    console.log("Change event triggered");
});

user.on("save", () => {
    console.log("Save event triggered");
});

console.log(user);

user.trigger("change");

/*
//fetch user
const user2 = new User({id: "5784"});
user2.fetch().then(() => {
console.log(user2.get("name"));
console.log(user2.get("age"));
}).catch((err) => {
    console.error(err);
});
*/

/*
console.log('save start');
//save new user
user.save().then(() => {
    console.log(user.get("id"));
}).catch((err) => {
    console.error(err);
});

console.log(user);
console.log('save end');

*/

import { User } from './models/User';

const collection = User.buidUserCollection();
collection.fetch().then(() => {
  collection.models.map(u => {
    console.log(u);
  });
});

collection.models.map(u => {
  console.log(u);
});
