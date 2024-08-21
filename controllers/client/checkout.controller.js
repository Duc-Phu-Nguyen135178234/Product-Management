const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId; 


  // Find the cart document in the database by its ID
  const cart = await Cart.findOne({
    _id: cartId
  }); 

  cart.totalPrice = 0; 

  // Check if the cart has any products
  if (cart.products.length > 0) { 

    for (const product of cart.products) { // Loop through each product in the cart
    
        // Find the product info in the database by its ID, selecting only necessary fields
      const productInfo = await Product.findOne({
        _id: product.productId
      }).select("title thumbnail slug price discountPercentage"); 

      productInfo.priceNew = (1 - productInfo.discountPercentage / 100) * productInfo.price; // Calculate the new price 

      product.productInfo = productInfo; // Attach the product info to the product in the cart

      product.totalPrice = productInfo.priceNew * product.quantity; // Calculate the total price 

      cart.totalPrice += product.totalPrice; // Add the product's total price to the cart's total price
    }
  }

  res.render("client/pages/checkout/index", {
    pageTitle: "Orders", 
    cartDetail: cart // Pass the cart details to the view 
  });
};
