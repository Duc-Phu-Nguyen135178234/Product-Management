const Product = require("../../model/product.model");
const ProductCategory = require("../../model/product-category.model");
const systemConfig = require("../../config/system");
const Account = require("../../model/account.model");
const moment = require("moment");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/createTree.helper");


// [GET] /admin/products/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };
  const filterStatus = [
    {
      label: "All",
      value: ""
    },
    {
      label: "Active",
      value: "active"
    },
    {
      label: "Inactive",
      value: "inactive"
    },
  ];
  if(req.query.status) {
    find.status = req.query.status;
  }
  // Search
  let keyword = "";
  if(req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
    keyword = req.query.keyword;
  }
  // End Search

  // Pagination
 
  const pagination = await paginationHelper(req, find); // goi ham pagination in helpers
  // End Pagination

  // Sort
  const sort = {};

  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const products = await Product
    .find(find)
    .limit(pagination.limitItems)
    .skip(pagination.skip)
    .sort(sort);


    for (const item of products) {
      if(item.createdBy) {
        const accountCreated = await Account.findOne({
          _id: item.createdBy
        });
        item.createdByFullName = accountCreated.fullName;
      } else {
        item.createdByFullName = "";
      }
  
      item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
      //user update
      if(item.updatedBy) {
        const accountUpdated = await Account.findOne({
          _id: item.updatedBy
        });
        item.updatedByFullName = accountUpdated.fullName;
      } else {
        item.updatedByFullName = "";
      }
  
      item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
  
    console.log(products);


  res.render("admin/pages/products/index", {
    pageTitle: "Product Manager",
    products: products,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}

//cach xu ly phuong thuc PATCH la update , post them moi 
// [GET] /admin/products/change-status/:statusChange/:id
// [PATCH] /admin/products/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  const { id, statusChange } = req.params;

  await Product.updateOne({
    _id: id
  }, {
    status: statusChange
  });

  req.flash('success', 'Status success updated!');

  res.json({
    code: 200
  });
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const { status, ids } = req.body;

  switch (status) {
    case "active":
    case "inactive":
      await Product.updateMany({
        _id: ids
      }, {
        status: status
      });
      break;
    case "delete":
      await Product.updateMany({
        _id: ids
      }, {
        deleted: true
      });
      break;
    default:
      break;
  }
  res.json({
    code: 200
  });
}


// [PATCH] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    deleted: true
  });

  //hien thi thong bao 
  req.flash('success', 'Success Deleted!');

  res.json({
    code: 200
  });
}

// [PATCH] /admin/products/change-position/:id
module.exports.changePosition = async (req, res) => {
  
  
  
  
  const id = req.params.id;
  const position = req.body.position;

  await Product.updateOne({
    _id: id
  }, {
    position: position
  });

  res.json({
    code: 200
  });
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false
  });

  const newCategories = createTreeHelper(categories);
  res.render("admin/pages/products/create", {
    pageTitle: "Add new products",
    categories: newCategories
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  
  //for uploadfile already using middlewares admin to upload file 
 
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countProducts = await Product.countDocuments({});
    req.body.position = countProducts + 1;
  }

  req.body.featured = req.body.hotProduct === 'true';

  req.body.createdBy = res.locals.account.id;

  const newProduct = new Product(req.body);
  await newProduct.save();

  res.redirect(`/${systemConfig.prefixAdmin}/products`);
}



// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false
    });

    if(product) {
      const categories = await ProductCategory.find({
        deleted: false
      });

      const newCategories = createTreeHelper(categories);

      res.render("admin/pages/products/edit", {
        pageTitle: "Updating Product",
        product:product,
        categories: newCategories
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    //uploadfile already use middle ware

    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countProducts = await Product.countDocuments({});
      req.body.position = countProducts + 1;
    }

    req.body.updatedBy = res.locals.account.id;
    
    await Product.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash("success", "Updating successful!");
  } catch (error) {
    req.flash("error", "Invaild Id!");
  }

  res.redirect("back");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false
    });

    if(product) {
      res.render("admin/pages/products/detail", {
        pageTitle: "Products Details",
        product: product
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
}