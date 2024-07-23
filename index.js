const express = require('express');
const dotenv = require('dotenv'); // Declare environment
const database = require("./config/database") // Declare connect database in config folder
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path= require('path');

const routes = require("./routes/client/index.route") // Declare route client
const routesadmin = require("./routes/admin/index.route") // Declare route admin
const systemConfig = require("./config/system");

//connect to database
dotenv.config();
database.connect();
//end connect to database

const app = express(); // Obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // Assign a port

//using path with __dirname to deploy vercel online . they know public is static
app.use(express.static(path.join(__dirname, 'public')));


//using path with __dirname to deploy vercel online and set view engine is pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//end __dirname for views


// App Locals Variables => hideen systemconfig for security. in config folder
app.locals.prefixAdmin = systemConfig.prefixAdmin;


//method-override is help use PATCH and DELETE
app.use(methodOverride('_method'));


// Flash
app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash


// parse application/x-www-form-urlencoded -- front end send a form && Json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//end parse

routes(app);
routesadmin(app);  
// Start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));


