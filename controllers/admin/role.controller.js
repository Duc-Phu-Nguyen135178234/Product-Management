const Role = require("../../model/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/index", {
    pageTitle: "Permission",
    records: records
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Add new permission",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
      const id = req.params.id;
  
      const record = await Role.findOne({
        _id: id,
        deleted: false
      });
  
      res.render("admin/pages/roles/edit", {
        pageTitle: "Updating authorize",
        record: record
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
  };
  
  // [PATCH] /admin/roles/edit/:id
  module.exports.editPatch = async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
  
      await Role.updateOne({
        _id: id,
        deleted: false
      }, data);
  
      req.flash("success", "Updating sucessful!");
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
      req.flash("error", "Update is unsucessful!");
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Authorize",
    records: records
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const roles = req.body;

  for (const role of roles) {
    await Role.updateOne({
      _id: role.id,
      deleted: false
    }, {
      permissions: role.permissions
    });
  }

  res.json({
    code: 200,
    message: "Update Successful!"
  });
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
   
    const roles = await Role.findOne({
      _id: id,
      deleted: false
    });

    if(roles) {
      res.render("admin/pages/roles/detail", {
        pageTitle: "Permission Details",
        roles: roles
      });
    } 
    else {
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
}


module.exports.delete = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne({
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