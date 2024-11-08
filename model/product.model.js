const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater'); // create slug like unquie slug on router
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy: String,
    updatedBy: String,
    deleted: {
        type: Boolean,
        default: false
      },
      featured: {
        type: Boolean,
        default: false // Set default to false
    },
      slug: {
        type: String,
        slug: "title",
        unique: true
      }
    }, {
      timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});


const Product = mongoose.model("Product", 
productSchema, "products");

module.exports = Product;

