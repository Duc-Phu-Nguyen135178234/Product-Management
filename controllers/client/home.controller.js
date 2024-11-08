
const Product = require("../../model/product.model");

module.exports.index = async (req, res) => {
  const productsFeatured = await Product
    .find({
      featured: "1",
      status: "active",
      deleted: false
    })
    .sort({ position: "desc" })
    .limit(3)
    .select("-description");

  for (const item of productsFeatured) {
    item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
  }

  const productsNew = await Product
    .find({
      status: "active",
      deleted: false
    })
    .sort({ position: "desc" })
    .limit(6)
    .select("-description");

  for (const item of productsNew) {
    item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
  }

  res.render("client/pages/home/index", {
    pageTitle: "HOME",
    productsFeatured: productsFeatured,
    productsNew: productsNew
  });
}