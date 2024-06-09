const express = require('express');
const dotenv = require('dotenv'); // Declare environment
const database = require("./config/database") // Declare connect database in config folder
const routes = require("./routes/client/index.route") // Declare route client
const routesadmin = require("./routes/admin/index.route") // Declare route admin
const systemConfig = require("./config/system");
dotenv.config();
database.connect();

const app = express(); // Obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // Assign a port
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');
// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
routes(app);
routesadmin(app);  
// Start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
