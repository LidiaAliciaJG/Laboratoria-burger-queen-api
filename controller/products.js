const { ObjectId } = require('mongodb');
const { connect } = require('../connect');

module.exports = {
    getProducts: async (req, resp, next) => {
        try {
            // console.log("GET IMPLEMENTED");
            const db = await connect();
            const collection = db.collection('product');
            const productCollection = await collection.find().toArray();
            resp.status(200).json(productCollection);
        } catch (error) {
            resp.status(401);
        }
    },

    getProductsUid: async (req, resp, next) => {
        // resp.send('GET one product by id IMPLEMENTED')
        console.log(req.params);
        try {
          const db = await connect();
          const productCollection = db.collection('product');
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
};