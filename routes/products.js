const { getProducts, getProductsUid, postProducts, deleteProduct, putProducts } = require('../controller/products');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

module.exports = (app, nextMain) => {
  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, getProductsUid);
  // app.get('/products/:productId', getProductsUid);

  app.post('/products', requireAdmin, postProducts);
  //app.post('/products', requireAdmin, (req, resp, next) => { resp.send("ruta post product") });

  app.put('/products/:productId', requireAdmin, putProducts);

  app.delete('/products/:productId', requireAdmin, deleteProduct);

  nextMain();
};
