const express = require('express');
const dotenv = require('dotenv'); // Declare environment
const database = require("./config/database") // Declare connect database in config folder
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const routes = require("./routes/client/index.route") // Declare route client
const routesadmin = require("./routes/admin/index.route") // Declare route admin
const systemConfig = require("./config/system");


dotenv.config();
database.connect();

const app = express(); // Obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // Assign a port
app.use(express.static('public'));

// Flash
app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash


// parse application/x-www-form-urlencoded -- front end send a form
app.use(bodyParser.urlencoded({ extended: false }));


// parse application/json -- front end send json
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'pug');
// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;


routes(app);
routesadmin(app);  
// Start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
//bai 18-2 38mins

