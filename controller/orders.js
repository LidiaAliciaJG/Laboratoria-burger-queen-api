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

    getOrderUid: (req, resp, next) => {
        resp.send("GET UID IMPLEMENTED");
    },

    putOrders: (req, resp, next) => {
        resp.send("PUT IMPLEMENTED");
    }
};