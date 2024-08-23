// routes/client/index.route.js
const HomeRouter = require("./home.route");
const ProductRouter = require("./product.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route")
const checkoutRoute = require("./checkout.route")
const userRoute = require("./user.route")


const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");


module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use(cartMiddleware.cartId); //using in controller to check cardID

    app.use(userMiddleware.infoUser);
    
    app.use('/', HomeRouter);

    app.use('/products', ProductRouter);  

    app.use("/detail/:slug", ProductRouter );

    app.use("/search", searchRoute);

    app.use('/cart', cartRoute)

    app.use("/checkout", checkoutRoute)

    app.use("/user", userRoute)

   
};
