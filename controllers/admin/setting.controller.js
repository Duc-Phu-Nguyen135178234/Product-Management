const Setting = require("../../model/setting.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const setting = await Setting.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "GENERAL",
    setting: setting
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const setting = await Setting.findOne({});

  if (setting) {
    await Setting.updateOne({
      _id: setting.id
    }, req.body);
    req.flash('success', 'Settings updated successfully!');
  } else {
    const record = new Setting(req.body);
    await record.save();
    req.flash('success', 'Settings created successfully!');
  }

  res.redirect('back');
};
