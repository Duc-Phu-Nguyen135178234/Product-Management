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



// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId; // Retrieve the order ID from the request parameters
    

    // Find the order document in the database by its ID
    const order = await Order.findOne({
      _id: orderId
    }); 
  
    let totalPrice = 0; 


    // Loop through each product in the order
    for (const item of order.products) { 

        // Find the product information in the database by its ID
      const productInfo = await Product.findOne({
        _id: item.productId
      }); 
      
      //add more key into item
      item.thumbnail = productInfo.thumbnail; 

      item.title = productInfo.title; 

      item.priceNew = (1 - item.discountPercentage / 100) * item.price;

      item.totalPrice = item.priceNew * item.quantity;
       
      totalPrice += item.totalPrice; // Add the item's total price to the overall total price
    }
  
    res.render("client/pages/checkout/success", {
      pageTitle: "Order Successful", // Set the page title to "Order Successful"
      order: order, // Pass the order details to the view
      totalPrice: totalPrice // Pass the calculated total price to the view
    });
};
