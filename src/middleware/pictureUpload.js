import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import { extname } from "path";
import ErrorResponse from "../utils/errorResponse.js";

const multerUploadCloudinary = () => {
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
      folder: "products",
    },
  });

  const upload = multer({
    storage: cloudinaryStorage,
    fileFilter: function (req, file, next) {
      const acceptedExt = [".png", ".jpg", ".gif", ".bmp", ".jpeg"];
      console.log(file);
      if (!acceptedExt.includes(extname(file.originalname))) {
        return next(
          new ErrorResponse(
            `Image type not allowed: ${extname(file.originalname)}`,
            400,
            "multerExt"
          )
        );
      }
      next(null, true);
    },
  });
  return upload.single("productPic");
};

export default multerUploadCloudinary;
