// routes/client/product.route.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/product.controller');

// Define the route for listing products
router.get('/', controller.index);
router.get("/detail/:slug", controller.detail);

module.exports = router;
