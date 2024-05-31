
const HomeRouter = require("./home.route");


module.exports = (app) =>{
  app.get('/', HomeRouter );
    
      app.get('/products', (req, res) => {
        res.render("client/pages/products/index.pug");
      });
}

