import multer from "multer";
import { Product } from "../models/product.js";
import { User } from "../models/UserModel.js";
import path from "path";
import fs from "fs";

function improveSlug(aaa) {
  const data = aaa.trim().replaceAll(" ", "-");
  return data;
}

const productDirectory = "./public/uploads/products";

if (!fs.existsSync(productDirectory)) {
  fs.mkdir(productDirectory, { recursive: true }, (err) => {
    if (err) {
      console.log(`${productDirectory} not created`, err);
      return;
    }
    console.log(`${productDirectory} created`);
  });
} else {
  console.log(`${productDirectory} already exist`);
}

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const productUpload = multer({ storage: productStorage });

export const uploadedImageresponse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "image is required",
      });
    }

    return res.status(200).json({
      message: "image uploaded successfully",
      imageUrl: `${process.env.mybackendUrl}/uploads/products/${req.file.filename}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "error sending image for product" });
  }
};

export const createProduct = async (req, res) => {
  const {
    productName,
    price,
    discount,
    dicCountedPrice,
    productDescription,
    slug,
    productImage,
  } = req.body;

  const id = req.id;
  try {
    const isAdmin = await User.findOne({ where: { id, adminValue: 1 } });
    if (!isAdmin)
      return res.status(400).json({ message: "not valid person to create it" });
    // check the improved slug
    const improvedSlug = improveSlug(slug);
    const uniqueSlug = await Product.findOne({ where: { slug: improvedSlug } });
    if (uniqueSlug)
      return res.status(400).json({ message: "this slug/url already in use" });

    const discountedPrice = price - price * (discount / 100);

    if (discountedPrice !== dicCountedPrice)
      return res.status(400).json({ message: "you are a hacker" });

    const product = await Product.create({
      productName,
      adminId: id,
      price,
      discount,
      dicCountedPrice,
      productDescription,
      slug: improvedSlug,
      productImage,
    });
    return res
      .status(201)
      .json({ message: "product created successfully", product });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error creating product", error: error.message });
  }
};

// get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["id", "DESC"]] });
    if (!products)
      return res.status(400).json({ message: "No product has been added..." });
    return res.status(200).json({ message: "All added products", products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting all products", error: error.message });
  }
};
// desctroy a product
export const destrySingleProduc = async (req, res) => {
  const { slug } = req.params;

  const id = req.id;
  try {
    const isValidUser = await User.findOne({ where: { id, adminValue: 1 } });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const isValidSlug = await Product.findOne({ where: { slug } });

    if (!isValidSlug)
      return res.status(400).json({ message: "invalid url/slug" });
    const deletedProduct = await isValidSlug.destroy();
    return res.json({ message: "deleted", product: deletedProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error creating product", error: error.message });
  }
};

// get a single product admin
export const getSingleProduct = async (req, res) => {
  const { slug } = req.params;
  const id = req.id;
  try {
    const isValidUser = await User.findOne({
      where: { id, adminValue: 1 },
      attributes: ["id", "adminValue", "username"],
    });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const isValidSlug = await Product.findOne({ where: { slug } });

    if (!isValidSlug)
      return res.status(400).json({ message: "invalid url/slug" });
    return res.json({
      message: "single products has been successfully retrieve",
      product: isValidSlug,
      user: isValidUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting single product", error: error.message });
  }
};
// update product

export const updateProduct = async (req, res) => {
  const { slug } = req.params;
  const id = req.id;
  const {
    productName,
    price,
    discount,
    dicCountedPrice,
    productDescription,
    productImage,
    slug: updatedSlug,
  } = req.body;
  try {
    const isValidUser = await User.findOne({
      where: { id, adminValue: 1 },
      attributes: ["id", "adminValue", "username"],
    });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const isValidSlug = await Product.findOne({ where: { slug } });

    if (!isValidSlug)
      return res.status(400).json({ message: "invalid url/slug" });

    const discountedPrice = price - price * (discount / 100);

    if (discountedPrice !== dicCountedPrice)
      return res.status(400).json({ message: "you are a hacker" });

    isValidSlug.productName = productName;
    isValidSlug.price = price;
    isValidSlug.discount = discount;
    isValidSlug.dicCountedPrice = dicCountedPrice;
    isValidSlug.productDescription = productDescription;
    if (productImage) {
      isValidSlug.productImage = productImage;
    }
    isValidSlug.slug = updatedSlug || "";
    await isValidSlug.save();
    return res.json({
      message: "product updated successfully",
      product: isValidSlug,
      user: isValidUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error updating product", error: error.message });
  }
};
// get producs for user
export const getAllProductsForUser = async (req, res) => {
  const id = req.id;
  try {
    const isValidUser = await User.findOne({
      where: { id },
      // attributes: ["id", "adminValue", "username"],
    });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });
    const products = await Product.findAll({ order: [["id", "DESC"]] });
    if (!products.length)
      return res.status(400).json({ message: "No product has been added..." });

    const safeProducts = products.map((product) => {
      const { adminId, createdAt, updatedAt, ...safeProduct } =
        product.toJSON();
      return safeProduct;
    });

    return res
      .status(200)
      .json({ message: "All added products", products: safeProducts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting all products", error: error.message });
  }
};
// get a single product user
export const getSingleProductForUser = async (req, res) => {
  const { slug } = req.params;
  const id = req.id;
  try {
    const isValidUser = await User.findOne({
      where: { id },
      attributes: ["id", "username"],
    });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const isValidSlug = await Product.findOne({ where: { slug } });

    if (!isValidSlug)
      return res.status(400).json({ message: "invalid url/slug" });
    return res.json({
      message: "single products has been successfully retrieve",
      product: isValidSlug,
      user: isValidUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting single product", error: error.message });
  }
};
