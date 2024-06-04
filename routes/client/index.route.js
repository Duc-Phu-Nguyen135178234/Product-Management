// routes/client/index.route.js
const HomeRouter = require("./home.route");
const ProductRouter = require("./product.route");

module.exports = (app) => {
    app.use('/', HomeRouter);
    app.use('/products', ProductRouter);  // Use the correct variable name
};
