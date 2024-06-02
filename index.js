const express = require('express');
const dotenv = require('dotenv'); // declar environment
const database = require("./config/database") // declair connect database in config folder
const routes = require("./routes/client/index.route") // declair route

dotenv.config();
database.connect();

const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port
app.use(express.static('public'));

app.set('views','./views');
app.set('view engine', 'pug'); 

routes(app);
  
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
