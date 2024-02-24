const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { connect } = require('../connect');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    // console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      // resp.send({ 'error': 'string' })
      return next(400);
    }

    // TODO: Authenticate the user
    try {
      const db = await connect();
      const collection = db.collection('user');
      // It is necessary to confirm if the email and password match a user in the database
      const userValid = await collection.findOne({ email });
      // console.log('Login del usuario: ', userValid);
      if (!userValid) {
        return next(404);
      }
      // const authPassword = password === userValid.password;
      const authPassword = await bcrypt.compare(password, userValid.password);
      // console.log('Password válida? ', authPassword);
      // If they match, send an access token created with JWT
      if (authPassword) {
        const token = jwt.sign(
          {
            uid: userValid._id,
            email: userValid.email,
            role: userValid.role,
          },
          secret,
          {
            expiresIn: '1h',
          },
        );
        // console.log('Token creado: ', token);
        resp.status(200).json({
          //token: token
          token: token,
           user: {
            id: userValid._id,
            email: userValid.email,
            role: userValid.role,
          },
        });
      } else {
        next(404);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return nextMain();
};
