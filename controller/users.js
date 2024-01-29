const { connect } = require("../connect");
const bcrypt = require('bcrypt');

module.exports = {
  getUsers: async (req, resp, next) => {
    // TODO: Implement the necessary function to fetch the `users` collection or table
    //resp.send('NOT IMPLEMENTED: users collection')

    try {
      const db = await connect();
      const collection = db.collection('user');
      //const userCollection = await collection.find({ role: "user" }).toArray(); //muestra users con role de user
      const userCollection = await collection.find().toArray(); //muestra todo user sin condiciones
      console.log("Usuarios: ", userCollection)
      //NO RETORNAR PASSWORD *recorrer array y solo elegir ciertos datos
      //resp.send(userCollection) //variará el Content-Type, no se asigna manualmente y uno simplemente envia datos
      resp.json(userCollection) //establece explícitamente el encabezado Content-Type de la respuesta como application/json. 
    } catch (error) {
      next(401)
    }
  },

  postUsers: async (req, resp, next) => {
    // TODO: Implement the route to add new users
    //resp.send('NOT IMPLEMENTED: post users')
    console.log("REQUEST POST USER: ", req.body);
    //const data = req.body;
    //valores de rol o email, etc es valido? realmente un email? rol valido?
    const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(400);
  }
  //if (es un email?) {
    
  //}
  //if (es un rol incluido en lo esperado?) {
    
  //}


    const addUser = {
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: role,
    };

    try {
      const db = await connect()
      const usersCollection = db.collection('user');

      const addUserExists = await usersCollection.findOne({
        email: email
      });

      if (!addUserExists) {
        let result = await usersCollection.insertOne(addUser);
        //funcion en insert para devolver el id (simula find)
        console.log(result);
        let getAddId = result.insertedId
        let getAddUser = await usersCollection.findOne({
          _id: getAddId
        });
        resp.send({
          "id": getAddId, //addUser._id,
          "email": getAddUser.email,//addUser.email,
          "role": getAddUser.role//addUser.role,
        })
        console.log('usuario agregado');
      } else {
        console.log('El correo ya esta registrado: ', addUserExists);
        next(403)
      }
    } catch (error) {
      console.error(error);
      next();
    }
  }
};
