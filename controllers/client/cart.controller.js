
const Cart = require("../../model/cart.model");

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
        //Use $ push to add into cart if they have same object ID . If not , they will create 
        //duplicate products in Cart
      $push: {
        products: {
          productId: productId,
          quantity: quantity
        }
      }
    });
  }

  res.redirect("back");
}