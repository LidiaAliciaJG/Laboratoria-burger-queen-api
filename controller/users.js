const { ObjectId } = require("mongodb");
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
      //resp.send(userCollection) //variará el Content-Type, no se asigna manualmente y uno simplemente envia datos
      //resp.json(userCollection) //establece explícitamente el encabezado Content-Type de la respuesta como application/json. 
      //NO RETORNAR PASSWORD -> recorrer array y solo elegir ciertos datos:
      const users = userCollection.map((user) => ({
        "id": user._id,
        "email": user.email,
        "role": user.role
      }))
      resp.json(users)
      console.log('usuarios mostrados');
    } catch (error) {
      next(401)
    }
  },

  getUser: async (req, resp, next) => {
    //resp.send('NOT IMPLEMENTED: GET one user by id')
    //console.log(req.params.uid);
    try {
      const db = await connect();
      const userCollection = db.collection('user');
      const uid = req.params.uid
      const userFind = await userCollection.findOne({ _id : new ObjectId(uid) }); //uid debe ser del mismo formato que la base de datos (mongodb maneja objectId)
      const user = {
        "id": userFind._id,
        "email": userFind.email,
        "role": userFind.role
      }
      resp.send(user)
      console.log(`usuario de id:${uid} mostrado`);
    } catch (error) {
      next(400);
    }
  },

  postUsers: async (req, resp, next) => {
    // TODO: Implement the route to add new users
    //resp.send('NOT IMPLEMENTED: post users')

    console.log("REQUEST POST USER: ", req.body);
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(400);
    }
    //ROLES : MESERO, JEFE DE COCINA, ADMIN
    const roleValid = ["waiter", "chef", "admin"];
    if (!roleValid.includes(role)) {
      return next(400);
    }

    /*const emailAt = email.split("@")
    const [ emailUser, emailDomain ] = emailAt
    const regexUser = /^[^\s@]+$/;
    const regexDomain = /^[^\s@]+\.[^\s@]+$/;
    if (!regexUser.test(emailUser) || !regexDomain.test(emailDomain) || !emailDomain) {
      console.log("usuario valido: ", regexUser.test(emailUser), "dominio valido: ", regexDomain.test(emailDomain));
      return next(400);
    }*/

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("email valido: ", regexEmail.test(email));
    if (!regexEmail.test(email)) {
      return next(400);
    }

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
          "id": getAddId, //addUser._id, -> se debe de obtener el id ya creado y guardado
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
