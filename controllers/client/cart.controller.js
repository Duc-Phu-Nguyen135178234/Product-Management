
const Cart = require("../../model/cart.model");

const Product = require("../../model/product.model");

//[GET] /cart
module.exports.index = async (req, res) => {
  // Retrieve the cartId from the cookies 
  const cartId = req.cookies.cartId;

  // Fetch the cart document from the database using the cartId.
  const cart = await Cart.findOne({
    _id: cartId
  });

  
  cart.totalPrice = 0;

  // Check any products in the cart.
  if (cart.products.length > 0) {
    
    for (const product of cart.products) {
      //find product in Cart
      const productInfo = await Product.findOne({
        _id: product.productId
      }).select("title thumbnail slug price discountPercentage");

      // Calculate the discounted price of the product.
      productInfo.priceNew = (1 - productInfo.discountPercentage / 100) * productInfo.price;

      // Attach the fetched product information to the product in the cart.
      product.productInfo = productInfo;

      // Calculate the total price for this product based on its quantity.
      product.totalPrice = productInfo.priceNew * product.quantity;

      // Add the product's total price to the cart's 
      cart.totalPrice += product.totalPrice;
    }
  }

  // Render the cart page with the cart details, passing the cart object to the view.
  res.render("client/pages/cart/index", {
    pageTitle: "Cart",
    cartDetail: cart
  });
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cart = await Cart.findOne({
      _id: cartId
    });
    const existProductInCart = cart.products.find(
      item => item.productId == productId
    );
    if(existProductInCart) {
      await Cart.updateOne({
        _id: cartId,
        'products.productId': productId
      }, {
        $set: {
          'products.$.quantity': quantity + existProductInCart.quantity
        }
      });
    } else {
      await Cart.updateOne({
        _id: cartId
      }, {
        $push: {
          products: {
            productId: productId,
            quantity: quantity
          }
        }
      });
    }
    res.redirect('/products');
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne({
    _id: cartId
  }, {
    $pull: {
      products: {
        productId: productId
      }
    }
  });

   res.redirect("back");
  }

  // [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
  
    await Cart.updateOne({
      _id: cartId,
      'products.productId': productId
    }, {
      $set: {
        'products.$.quantity': quantity
      }
    });
  
    res.redirect("back");

}