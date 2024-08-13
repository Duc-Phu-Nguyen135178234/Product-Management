// routes/client/index.route.js
const HomeRouter = require("./home.route");
const ProductRouter = require("./product.route");
const searchRoute = require("./search.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use('/', HomeRouter);

    app.use('/products', ProductRouter);  

    app.use("/detail/:slug", ProductRouter );

    app.use("/search", searchRoute);
   
};
