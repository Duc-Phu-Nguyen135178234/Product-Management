const Product = require("../../model/product.model");

const paginationHelper = require("../../helpers/pagination.helper");


// [GET] /admin/products/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };
  const filterStatus = [
    {
      label: "Tất cả",
      value: ""
    },
    {
      label: "Hoạt động",
      value: "active"
    },
    {
      label: "Dừng hoạt động",
      value: "inactive"
    },
  ];
  if(req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm
  let keyword = "";
  if(req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
    keyword = req.query.keyword;
  }
  // Hết Tìm kiếm

  // Phân trang
 
  const pagination = await paginationHelper(req, find); // goi ham pagination in helpers
  // Hết Phân trang

  const products = await Product
    .find(find)
    .limit(pagination.limitItems)
    .skip(pagination.skip);
  // console.log(products);
  res.render("admin/pages/products/index", {
    pageTitle: "Quản lý sản phẩm",
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
  res.json({
    code: 200
  });
}