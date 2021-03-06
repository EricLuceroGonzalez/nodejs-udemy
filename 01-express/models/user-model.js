const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    db.collection("users")
      .insertOne(this)
      .then((userCreated) => {
        console.log("created user!");
      })
      .catch((err) => {});
  }
  static findById(userId) {
    const db = getDb();
    return db.collection("users").find({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
