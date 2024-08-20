const Cart = require("../../model/cart.model");

module.exports.cartId = async (req, res, next) => {
  
  if (!req.cookies.cartId) {
    
    const cart = new Cart();
    
    await cart.save();

    // Set the cookie expiration time 
    const expires = 365 * 24 * 60 * 60 * 1000;

    // Set a cookie named 'cartId' with the value of the new cart's ID and the expiration time
    res.cookie(
      "cartId", 
      cart.id, 
      { 
        expires: new Date(Date.now() + expires) 
      });
  } else {
    // If the cartId cookie exists, 
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });

    // Set the number of products in the cart as 'cartTotal' in res.locals
    // If the cart has no products, it defaults to 0
    res.locals.cartTotal = cart.products.length || 0;
  }

   next();
}
