const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { connect } = require('../connect');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
// const { isAdmin } = require('../middleware/auth');

module.exports = {
  getUsers: async (req, resp) => {
    // getUsers: async (req, resp, next) => {
    // TODO: Implement the necessary function to fetch the `users` collection or table
    // resp.send('NOT IMPLEMENTED: users collection')

    try {
      const db = await connect();
      const collection = db.collection('user');
      // const userCollection = await collection.find({ role: "user" }).toArray();
      const userCollection = await collection.find().toArray(); // muestra todo user sin condiciones
      // resp.send(userCollection) variará el Content-Type
      // resp.json(userCollection) establece el encabezado Content-Type de la respuesta como json.
      // NO RETORNAR PASSWORD -> recorrer array y solo elegir ciertos datos:
      const users = userCollection.map((user) => ({
        _id: user._id,
        email: user.email,
        role: user.role,
      }));
      resp.status(200).json(users);
      // console.log('usuarios mostrados');
    } catch (error) {
      resp.json({ error });
    }
  },

  postUsers: async (req, resp) => {
    // postUsers: async (req, resp, next) => {
    // TODO: Implement the route to add new users
    // resp.send('NOT IMPLEMENTED: post users')

    console.log("REQUEST POST USER: ", req.body);
    const { email, password, role } = req.body;
    if (!email || !password) {
      // if (!email || !password || !role) {
      return resp.status(400).json({ error: 'email, role or password is not provided' });
    }
    // ROLES : MESERO, JEFE DE COCINA, ADMIN
    /* COMENTADO POR TEST e2e QUE NO INCLUYE ROL
    const roleValid = ['waiter', 'chef', 'admin'];
    const roleLow = role.toLowerCase();
    if (!roleValid.includes(roleLow)) {
      return resp.status(400).json({ error: 'role is not valid' });
    } */

    /* const emailAt = email.split("@")
    const [ emailUser, emailDomain ] = emailAt
    const regexUser = /^[^\s@]+$/;
    const regexDomain = /^[^\s@]+\.[^\s@]+$/;
    if (!regexUser.test(emailUser) || !regexDomain.test(emailDomain) || !emailDomain) {
      console.log(regexUser.test(emailUser), regexDomain.test(emailDomain));
      return next(400);
    } */

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailLow = email.toLowerCase(); // email minusculas y mayusculas como iguales
    // console.log('email valido: ', regexEmail.test(emailLow));
    if (!regexEmail.test(emailLow)) {
      return resp.status(400).json({ error: 'email is not valid' });
    }

    //DEFINIR CRITERIOS DE VALIDACIÓN PARA PASSWORD
    if (password.length<3) { 
      return resp.status(400).json({ error: 'password is not valid' });
    }

    const addUser = {
      email: emailLow,
      password: bcrypt.hashSync(password, 10),
      role,
    };

    try {
      const db = await connect();
      const usersCollection = db.collection('user');

      const addUserExists = await usersCollection.findOne({
        email: emailLow,
      });

      console.log(addUserExists);
      if (!addUserExists) {
        console.log("dentro de adduserExist");
        const result = await usersCollection.insertOne(addUser);
        // funcion en insert para devolver el id (simula find)
        // console.log(result);
        const getAddId = result.insertedId;
        const getAddUser = await usersCollection.findOne({
          _id: getAddId,
        });
        console.log(getAddUser, getAddUser.role);
        resp.status(200).json({
          _id: getAddId, // addUser._id, -> se debe de obtener el id ya creado y guardado
          email: getAddUser.email, // addUser.email,
          role: getAddUser.role, // addUser.role,
        });
        // console.log('usuario agregado');
      } else {
        // console.log('El correo ya esta registrado: ', addUserExists);
        resp.status(403).json({ error: 'a user with that email already exists' });
      }
    } catch (error) {
      console.error(error);
    }
  },

  getUserUid: async (req, resp, next) => {
    // resp.send('NOT IMPLEMENTED: GET one user by id')
    // console.log(req);

    try {
      //isAdmin(req) middleware auth
      const { authorization } = req.headers;
      const [type, token] = authorization.split(' ');
      const decodedToken = jwt.verify(token, secret);
      console.log("TOKEN DE ADMIN? ", decodedToken.role === 'admin');
      console.log(decodedToken);

      const db = await connect();
      const userCollection = db.collection('user');
      const { uid } = req.params;
      console.log(uid);
      /* //marca error por no ser un objeto válido
      const userFind = await userCollection.findOne({
        $or: [ { email: uid }, { _id: new ObjectId(uid) } ]
      }); */
      let userFind = '';
      if (ObjectId.isValid(uid)) {
        // uid mismo formato que la base de datos (mongodb maneja objectId)
        userFind = await userCollection.findOne({ _id: new ObjectId(uid) });
      } else {
        const uidEmail = uid.toLowerCase();
        userFind = await userCollection.findOne({ email: uidEmail });
      }
      const owner = userFind._id.equals(new ObjectId(decodedToken.uid));
      const admin = decodedToken.role === 'admin';
      console.log(userFind._id, new ObjectId(decodedToken.uid));
      console.log(owner, admin);
      if (!owner && !admin) {
        console.log("next 403");
        next(403);
      } else {
        const user = {
          _id: userFind._id,
          email: userFind.email,
          role: userFind.role,
        };
        resp.status(200).json(user);
        // console.log(`usuario de id/email:${uid} mostrado`);
      }
    } catch (error) {
      console.error(error);
      resp.status(404).send('user does not exist');
    }
  },

  updateUserUid: async (req, resp, next) => {
    // resp.send('NOT IMPLEMENTED: PUT/PATCH one user by id')
    console.log(req.params.uid, req.body);
    try {
      const { authorization } = req.headers;
      const [type, token] = authorization.split(' ');
      const decodedToken = jwt.verify(token, secret);
      console.log(decodedToken);

      const db = await connect();
      const userCollection = db.collection('user');
      const { uid } = req.params;
      let userFind = '';

      if (ObjectId.isValid(uid)) {
        userFind = await userCollection.findOne({ _id: new ObjectId(uid) });
      } else {
        userFind = await userCollection.findOne({ email: uid.toLowerCase() });
      }
      const owner = userFind._id.equals(new ObjectId(decodedToken.uid));
      const admin = decodedToken.role === 'admin';
      console.log(userFind._id, new ObjectId(decodedToken.uid));
      console.log(owner, admin);
      if (!owner && !admin) {
        next(403);
      } else {
        const { email, password, role } = req.body;
        if (!email && !password && !role) {
          return resp.status(400).json({ error: 'email, role or password is not provided' });
        }

        const updateFields = {};

        if (password) {
          updateFields.password = bcrypt.hashSync(password, 10)
          console.log(updateFields);
        }

        if (role) {
          if (!admin) {
            console.log("no admin is changing role, error 403");
            return resp.status(403).json("no admin is changing role, error 403")
          } else {
            const roleValid = ['waiter', 'chef', 'admin'];
            updateFields.role = role.toLowerCase();
            if (!roleValid.includes(updateFields.role)) {
              return resp.status(400).json({ error: 'role is not valid' });
            }
          }
        }

        if (email) {
          const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          updateFields.email = email.toLowerCase();
          if (!regexEmail.test(updateFields.email)) {
            return resp.status(400).json({ error: 'email is not valid' });
          }
        }
        /*userFind = await userCollection.findOneAndUpdate(
          { $or: [{ _id: new ObjectId(uid) }, { email: uid.toLowerCase() }] },
          { $set: updateFields },
          { returnDocument: 'after' },
        );*/
        if (ObjectId.isValid(uid)) {
          userFind = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(uid) },
            { $set: updateFields },
            { returnDocument: 'after' }
            );
        } else {
          userFind = await userCollection.findOneAndUpdate(
            { email: uid.toLowerCase() },
            { $set: updateFields },
            { returnDocument: 'after' }
          );
        }
        console.log(userFind);

        const user = {
          _id: userFind._id,
          email: userFind.email,
          role: userFind.role,
        };
        resp.status(200).json(user);
      }
    } catch (error) {
      console.error(error);
      resp.status(404).send('user does not exist');
    }
  },

  deleteUserUid: async (req, resp, next) => {
    // resp.send('NOT IMPLEMENTED: DELETE one user by id')
    try {
      const { authorization } = req.headers;
      const [type, token] = authorization.split(' ');
      const decodedToken = jwt.verify(token, secret);
      console.log(decodedToken);

      const db = await connect();
      const userCollection = db.collection('user');
      const { uid } = req.params;

      let userFind = '';
      if (ObjectId.isValid(uid)) {
        userFind = await userCollection.findOne({ _id: new ObjectId(uid) });
        console.log(userFind);
      } else {
        userFind = await userCollection.findOne({ email: uid.toLowerCase() });
        console.log(userFind);
      }

      const owner = userFind._id.equals(new ObjectId(decodedToken.uid));
      const admin = decodedToken.role === 'admin';
      console.log(userFind._id, new ObjectId(decodedToken.uid));
      console.log(owner, admin);
      if (!owner && !admin) {
        console.log("next 403");
        next(403);
      } else {
        if (ObjectId.isValid(uid)) {
          userFind = await userCollection.findOneAndDelete({ _id: new ObjectId(uid) });
          console.log("uid found and deleted");
        } else {
          userFind = await userCollection.findOneAndDelete({ email: uid.toLowerCase() });
          console.log("email found and deleted");
        }
        const user = {
          _id: userFind._id,
          email: userFind.email,
          role: userFind.role,
        };

        resp.status(200).json(user);
      }
    } catch (error) {
      console.error(error)
      resp.status(404).json('user does not exist');
    }
  },
};
