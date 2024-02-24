const { connect } = require('../connect');

module.exports = {
    postOrders: (req, resp, next) => {
        resp.send("POST IMPLEMENTED");
    },
    
    getOrders: async (req, resp, next) => {
        try {
            console.log("GET IMPLEMENTED");
            const db = await connect();
            const collection = db.collection('order');
            const ordersCollection = await collection.find().toArray();
            resp.status(200).json(ordersCollection);
        } catch (error) {
            resp.status(401);
        }
    },

    getOrderUid: async (req, resp, next) => {
        resp.send("GET UID IMPLEMENTED");
        console.log(req.params);
        try {
          const db = await connect();
          const productCollection = db.collection('order');
          const { productId } = req.params;
          console.log(productId);
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

    putOrders: (req, resp, next) => {
        resp.send("PUT IMPLEMENTED");
    }
};