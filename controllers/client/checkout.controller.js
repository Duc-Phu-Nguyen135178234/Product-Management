const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const Order = require("../../model/order.model");

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


//[Post] //checkout/order
module.exports.orderPost = async (req,res) =>{

    const cartId = req.cookies.cartId; // Retrieve the cart ID from the user's cookies
    const userInfo = req.body; // Get the user information from the request body
    
    // create the order data
    const orderData = {
      userInfo: userInfo, //get from req.body
      products: [] 
    };
    

    // Find the cart document in the database by its ID
    const cart = await Cart.findOne({
      _id: cartId
    }); 


    // Loop through each product in the cart
    for (const item of cart.products) { 


    // Find productId
      const productInfo = await Product.findOne({
        _id: item.productId
      }); 


      // Add the product ID to the order data

      orderData.products.push({
        productId: item.productId, 

        price: productInfo.price, 

        discountPercentage: productInfo.discountPercentage, 

        quantity: item.quantity 
      }); 
    }


    // Create a new Order object using the order data and Save
    const order = new Order(orderData); 
    await order.save(); 
    

     // Clear the products in the cart by updating the cart in the database
    await Cart.updateOne({
      _id: cartId
    }, {
      products: []
    });
    
    res.redirect(`/checkout/success/${order.id}`);
}