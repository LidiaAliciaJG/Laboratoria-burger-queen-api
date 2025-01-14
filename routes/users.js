const bcrypt = require('bcrypt');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers, postUsers, getUserUid, updateUserUid, deleteUserUid,
} = require('../controller/users');

const { connect } = require('../connect');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    role: 'admin',
  };

  // TODO: Create admin user
  // First, check if adminUser already exists in the database
  // If it doesn't exist, it needs to be saved
  try {
    const db = await connect();
    const usersCollection = db.collection('user');

    const adminUserExists = await usersCollection.findOne({
      email: adminEmail,
      // role: "admin",
    });

    if (!adminUserExists) {
      await usersCollection.insertOne(adminUser);
    } else {
      // console.log('El  administrador ya existe: ');
      // console.log(adminUserExists);
    }

    next();
  } catch (error) {
    // Manejar el error de la consulta a la base de datos
    console.error(error);
    next();
  }
};

/*
 *
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */

module.exports = (app, next) => {
  app.get('/users', requireAdmin, getUsers); // DONE // para pruebas de getUsers se puede borrar requireAdmin

  app.get('/users/:uid', requireAuth, getUserUid); // DONE

  app.post('/users', requireAdmin, postUsers); // DONE

  app.put('/users/:uid', requireAuth, updateUserUid); // DONE

  app.delete('/users/:uid', requireAuth, deleteUserUid); // DONE

  // probar las pruebas e2e (end to end) DONE
  initAdminUser(app, next);
};
