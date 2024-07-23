const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({ 
  cloud_name: "dehcsl5k3", 
  api_key:"383359944116932" , 
  api_secret: "xKuPfNKlod7sB1CWJU0iPxUysNk"
});


module.exports.uploadSingle = (req, res, next) => {
  if(req.file) {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    }

    const uploadToCloudinary = async (buffer) => {
      const result = await streamUpload(buffer);
      req.body[req.file.fieldname] = result.url;
      next();
    }

    uploadToCloudinary(req.file.buffer);
  } else {
    next();
  }
}