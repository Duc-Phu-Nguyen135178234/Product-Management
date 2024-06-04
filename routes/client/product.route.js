// routes/client/product.route.js
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/product.controller');

// Define the route for listing products
router.get('/', productController.index);

module.exports = router;
