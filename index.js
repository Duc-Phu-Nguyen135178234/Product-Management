const express = require('express'); // "require" the Express module

const routes = require("./routes/client/index.route")

const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.set('views','./views');
app.set('view engine', 'pug'); 

routes(app);
  
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
