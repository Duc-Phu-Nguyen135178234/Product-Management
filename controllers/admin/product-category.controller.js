
const ProductCategory = require("../../model/product-category.model");
const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree.helper");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    const records = await ProductCategory.find({
      deleted: false
    });

     
    console.log(records);
  
    res.render("admin/pages/products-category/index", {
        pageTitle: "Category List",
        records: records
    });
  }
  // [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const categories = await ProductCategory.find({
        deleted : false
    });

    const newCategories = createTreeHelper(categories);

    res.render("admin/pages/products-category/create", {
      pageTitle: "Add new categories",
      categories : newCategories
    });
  }
  
  // [POST] /admin/products-category/create
  module.exports.createPost = async (req, res) => {
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countCagegory = await ProductCategory.countDocuments({});
      req.body.position = countCagegory + 1;
    }
  
    const newCategory = new ProductCategory(req.body);
    await newCategory.save();
  
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const category = await ProductCategory.findOne({
    _id: id,
    deleted: false
  });

  const categories = await ProductCategory.find({
    deleted: false
  });

  const newCategories = createTreeHelper(categories);

  res.render("admin/pages/products-category/edit", {
    pageTitle: "Updating Categories",
    categories: newCategories,
    category: category
  });
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countCagegory = await ProductCategory.countDocuments({});
    req.body.position = countCagegory + 1;
  }

  await ProductCategory.updateOne({
    _id: id,
    deleted: false
  }, req.body);

  req.flash("success", "Updated is sucessful !");

  res.redirect(`back`);
}

//[Delete]/admin/products-category/delete/:id
module.exports.delete = async (req,res)=>{
  const id = req.params.id;

  await ProductCategory.updateOne({
    _id: id,
    deleted : false
  }, {
    deleted: true
  });

  //req.flash('success', 'Success Deleted!');

  res.json({
    code: 200
  });
}

module.exports.detail = async (req,res) =>{
  try{
    const id = req.params.id;

    const category = await ProductCategory.findOne({
      _id : id,
      deleted:false
    });

    if (category){
        res.render("admin/pages/products-category/detail", {
          pageTitle: "Categories Details",
          category: category
        });
      } 
      
    }
  catch (error){
    res.redirect('back');
  }
  
 
}