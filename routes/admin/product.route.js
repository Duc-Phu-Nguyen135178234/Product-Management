const express = require("express");
const multer  = require('multer');
const router = express.Router();

const controller = require("../../controllers/admin/product.controller"); //include this file
const validate = require("../../validates/admin/product.validate"); //include file validating form
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware"); //include file upload file using Cloudinary

//We upload file to cloudinary so that we DO NOT need storage helperhere
// // upload file using multer . create helpers storageMulter.helper for reuse
// const storageMulterHelper = require("../../helpers/storageMulter.helper");


const upload = multer(); // using for upload file to Cloudinary


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
    uploadCloud.uploadSingle, //uploadCloud had include on top , now using
    validate.createPost, //validate had include on top , now using
    controller.createPost
  );
//end upload file

//Router [Get] /edit/:id
router.get("/edit/:id", controller.edit);

//Router [Patch] /edit/:id
router.patch(
  "/edit/:id", 
  upload.single('thumbnail'),
  uploadCloud.uploadSingle, //uploadCloud had include on top , now using
  validate.createPost, //validate had include on top , now using
  controller.editPatch
);

//Router [GET] /detail/:id
router.get("/detail/:id", controller.detail);

module.exports = router;