const { connect } = require("../connect");

module.exports = {
  getUsers: async (req, resp, next) => {
    // TODO: Implement the necessary function to fetch the `users` collection or table
    //resp.send('NOT IMPLEMENTED: users collection')

    try {
      const db = await connect();
      const collection = db.collection('user');
      //const userCollection = await collection.find({ role: "user" }).toArray(); //muestra users con role de user
      const userCollection= await collection.find().toArray(); //muestra todo user sin condiciones
      console.log("Usuarios: ", userCollection) 
      //NO RETORNAR PASSWORD *recorrer array y solo elegir ciertos datos
      //resp.send(userCollection) //variará el Content-Type, no se asigna manualmente y uno simplemente envia datos
      resp.json(userCollection) //establece explícitamente el encabezado Content-Type de la respuesta como application/json. 
    } catch (error) {
      next(401)
    }
  },

  /*postUsers: (req, resp, next) => {
    resp.send('NOT IMPLEMENTED: post users')
  }*/
};
