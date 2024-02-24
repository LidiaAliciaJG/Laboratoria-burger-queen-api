const { connect } = require('../connect');
const { ObjectId } = require('mongodb');

module.exports = {
  postOrders: async (req, resp, next) => {
    // resp.send("POST IMPLEMENTED");
    // console.log(req.body);
    const { userId, client, products, status } = req.body;

    const addOrder = {
      userId,
      client,
      products,
      status,
      dateEntry: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    try {
      const db = await connect();
      const orderCollection = db.collection('order');

      const addOrderExists = await orderCollection.findOne({ client });

      if (!addOrderExists) {
        const result = await orderCollection.insertOne(addOrder);
        const getAddId = result.insertedId;
        const getAddOrder = await orderCollection.findOne({ _id: getAddId });


        resp.status(200).json(getAddOrder);
      } else {
        resp.status(403).json({ error: 'an order for that client already exists' });
      }
    } catch (error) {
      console.error(error);
    }
  },

  getOrders: async (req, resp, next) => {
    try {
      // console.log("GET IMPLEMENTED");
      const db = await connect();
      const collection = db.collection('order');
      const ordersCollection = await collection.find().toArray();
      resp.status(200).json(ordersCollection);
    } catch (error) {
      resp.status(401);
    }
  },

  getOrderUid: async (req, resp, next) => {
    // resp.send("GET UID IMPLEMENTED");
    // console.log(req.params);
    try {
      const db = await connect();
      const productCollection = db.collection('order');
      const { productId } = req.params;
      // console.log(productId);
      let productFind = '';
      if (ObjectId.isValid(productId)) {
        productFind = await productCollection.findOne({ _id: new ObjectId(productId) });
      } else {
        productFind = await productCollection.findOne({ name: { $regex: productId, $options: 'i' } });
      }
      if (!productFind) {
        resp.status(404).json('product not found');
      } else {
        resp.status(200).json(productFind);
      }
    } catch (error) {
      console.error(error);
      resp.status(404).send('product does not exist');
    }
  },

  putOrders: async (req, resp, next) => {
    // resp.send("PUT IMPLEMENTED");
    console.log(req.params.orderId, req.body);
    try {
      const db = await connect();
      const orderCollection = db.collection('order');
      const { orderId } = req.params;
      let orderFind = '';

        const { status } = req.body;
        if (!status) {
          return resp.status(400).json({ error: 'status is not provided' });
        }

        const updateFields = {
          status,
          dateProcessed: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        if (ObjectId.isValid(orderId)) {
          orderFind = await orderCollection.findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: updateFields },
            { returnDocument: 'after' }
          );

          resp.status(200).json(orderFind);
        } else {
          resp.status(404).json('error');
        }
    } catch (error) {
      resp.status(404).send('order does not exist');
    }
  }
};