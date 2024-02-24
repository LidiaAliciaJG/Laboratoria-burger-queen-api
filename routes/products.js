const { getProducts, getProductsUid, postProducts } = require('../controller/products');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

module.exports = (app, nextMain) => {
  app.get('/products', requireAuth, getProducts);

  //app.get('/products/:productId', requireAuth, getProductsUid);

  //app.post('/products', requireAdmin, postProducts);
  app.post('/products', (req, resp, next) => {
    resp.send("ruta post product")
  });

  app.put('/products/:productId', requireAdmin, (req, resp, next) => {
  });

  app.delete('/products/:productId', requireAdmin, (req, resp, next) => {
  });

  nextMain();
};
