import multer from "multer";
import fs from "fs";

const uploadDir = "./public/uploads";

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // create upload folder if not exist

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export const multerFileHandle = async (req, res) => {
  try {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(500)
          .json({ message: "Multer error", error: err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ message: "Unknown error", error: err.message });
      }
      // File uploaded successfully
      return res
        .status(200)
        .json({ message: "File uploaded successfully", file: req.file });
    });
  } catch (error) {
    return res.status(500).json({
      message: "unable to upload file",
      error: error.message,
    });
  }
};
