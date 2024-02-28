const { getOrders, getOrderUid, postOrders, putOrders, deleteOrders } = require('../controller/orders');
const {
  requireAuth,
} = require('../middleware/auth');

module.exports = (app, nextMain) => {
  app.get('/orders', requireAuth, getOrders);

  app.get('/orders/:orderId', requireAuth, getOrderUid);

  app.post('/orders', requireAuth, postOrders);

  app.put('/orders/:orderId', requireAuth, putOrders);

  app.delete('/orders/:orderId', requireAuth, deleteOrders);

  nextMain();
};
