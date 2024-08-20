// routes/client/index.route.js
const HomeRouter = require("./home.route");
const ProductRouter = require("./product.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route")

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use(cartMiddleware.cartId); //using in controller to check cardID

    app.use('/', HomeRouter);

    app.use('/products', ProductRouter);  

    app.use("/detail/:slug", ProductRouter );

    app.use("/search", searchRoute);

    app.use('/cart', cartRoute)
   
};
