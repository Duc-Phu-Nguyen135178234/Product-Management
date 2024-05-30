const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.set('views','./views');
app.set('view engine', 'pug'); 

app.get('/', (req, res) => {
    res.render("client/pages/home/index.pug");
  });

  app.get('/products', (req, res) => {
    res.render("client/pages/products/index.pug");
  });
  
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
