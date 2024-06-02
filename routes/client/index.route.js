
const HomeRouter = require("./home.route");

const ProductRoute = require("./product.route");

module.exports = (app) =>{
  app.use('/', HomeRouter );
    
  app.use('/product', ProductRoute);
}

