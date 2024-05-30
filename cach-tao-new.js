/**
 * npm init
 * npm i express
 * npm i --save-dev nodemon
 * them script  "start": "nodemon --inspect index.js",
 * tao file index.js
 * ***********************************************************************************************
 * const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port


app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.get('/products', (req, res) => {
    res.send('danh sach san pham');
  });
  
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
********************************************************************************************************
tao du an new day len github
dau tien phai tao .gitignore 
git init
git add .
git commit -m "create new"
git remote add origin https://github.com/Duc-Phu-Nguyen135178234/Product-Management.git
git push
********************************************************************************************************
tao folder views
create folder views/client/pages
trong pages co 2 folder home and product deu co 2 file pug
********************************************************************************************************
create folder routes . trong routes co mot ham chua het routes tu index.js cat sang

module.exports = (app) =>{
    app.get('/', (req, res) => {
        res.render("client/pages/home/index.pug");
      });
    
      app.get('/products', (req, res) => {
        res.render("client/pages/products/index.pug");
      });
}

ben file index nhung file index.routes.js
********************************************************************************************************
const express = require('express'); // "require" the Express module

const routes = require("./routes/index.routes") // nhung file routes vao

const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.set('views','./views');
app.set('view engine', 'pug'); 

routes(app); // routes truyen app vao 
  
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
********************************************************************************************************
 */