const { connect } = require("../connect");

module.exports = {
  getUsers: async (req, resp, next) => {
    // TODO: Implement the necessary function to fetch the `users` collection or table
    //resp.send('NOT IMPLEMENTED: users collection')

    const db = await connect();
      const collection = db.collection('user');
      const userCollection= collection.findOne({ role: "user" }); //find - condiciones / pedir
      console.log("Usuarios: ", userCollection)
    next(200)
  },
};
