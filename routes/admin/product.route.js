const express = require("express");
const multer  = require('multer');
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");

//using for validating form
const validate = require("../../validates/admin/product.validate");

// upload file using multer . create helpers storageMulter.helper for reuse
const storageMulterHelper = require("../../helpers/storageMulter.helper");


const upload = multer({ storage: storageMulterHelper.storage });
//end add multer

router.get("/", controller.index);

// router.get("/change-status/:statusChange/:id", controller.changeStatus);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete/:id", controller.deleteItem);

router.patch("/change-position/:id", controller.changePosition);

router.get("/create", controller.create);

// upload file 
router.post(
    "/create", 
    upload.single('thumbnail'),
    validate.createPost,
    controller.createPost
  );
//end upload file

//Router [Get] /edit/:id
router.get("/edit/:id", controller.edit);

//Router [Patch] /edit/:id
router.patch(
  "/edit/:id", 
  upload.single('thumbnail'),
  validate.createPost,
  controller.editPatch
);

//Router [GET] /detail/:id
router.get("/detail/:id", controller.detail);

module.exports = router;