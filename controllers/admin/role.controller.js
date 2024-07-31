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
      res.redirect("back");
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