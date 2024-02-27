const { ObjectId } = require('mongodb');
const { connect } = require('../connect');

module.exports = {
  postProducts: async (req, resp) => {
    // console.log("REQUEST POST PRODUCTS: ", req.body);
    const { name, price, image, type } = req.body;
    if (!name || !price) {
      return resp.status(400).json({ error: 'name or price is not provided' });
    }

    const addProduct = {
      name,
      price,
      image,
      type,
      dateEntry: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    try {
      const db = await connect();
      const productCollection = db.collection('product');

      const addProductExists = await productCollection.findOne({ name });
      // console.log(!addProductExists, addProductExists);

      if (!addProductExists) {
        const result = await productCollection.insertOne(addProduct);
        const getAddId = result.insertedId;
        const getAddProduct = await productCollection.findOne({ _id: getAddId });
        console.log(typeof getAddProduct._id, typeof getAddProduct.name, typeof getAddProduct.price, typeof getAddProduct.image, typeof getAddProduct.type);
        resp.status(200).json(getAddProduct);
      } else {
        resp.status(403).json({ error: 'a product with that name already exists' });
      }
    } catch (error) {
      console.error(error);
    }
  },
  
  getProducts: async (req, resp, next) => {
    try {
      // console.log("GET IMPLEMENTED");
      const db = await connect();
      const collection = db.collection('product');
      const productCollection = await collection.find().toArray();
      // console.log(productCollection[0]._id.toString());
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

  deleteProduct: async (req, resp, next) => {
    // resp.send("DELETE NOT IMPLEMENTED")
    console.log(req.params);
    try {
      const db = await connect();
      const productCollection = db.collection('product');
      const { productId } = req.params;
      console.log(productId);
      let productFind = '';
      if (ObjectId.isValid(productId)) {
        productFind = await productCollection.findOneAndDelete({ _id: new ObjectId(productId) });
      } else {
        productFind = await productCollection.findOneAndDelete({ name: { $regex: productId, $options: 'i' } });
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
  }
};