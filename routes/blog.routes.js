import express from "express";
import {
  blogImageUpload,
  createBlog,
  deleteBlogByAdmin,
  getAllBlogs,
  getAllBlogsForSingleAdmin,
  getAllBlogsPublic,
  singleBlogAdmin,
  singleBlogPublic,
  thumbnailUpload,
  updateSingleBlogAdmin,
} from "../controllers/blog.controller.js";
import { adminCheck, checkLogin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/blogs", getAllBlogsPublic); //for user without published
router.get("/blog/:slug", singleBlogPublic); // for public blog with slug

router.post(
  "/blog",
  checkLogin,
  adminCheck,

  createBlog,
); //admin create blog
router.get("/blogs", checkLogin, adminCheck, getAllBlogs); //for admin
// get block only for the admin
router.get(
  "/blog/blogs-single-admin",
  checkLogin,
  adminCheck,
  getAllBlogsForSingleAdmin,
); // for single admin blog

router.get("/blog/:slug", checkLogin, adminCheck, singleBlogAdmin); //admin
router.patch("/blog/:slug", checkLogin, adminCheck, updateSingleBlogAdmin); //admin
router.delete("/blog/:slug", checkLogin, adminCheck, deleteBlogByAdmin); //admin
// blog file upload
router.post(
  "/blog-image-upload",
  blogImageUpload.single("image"),
  (req, res) => {
    res.json({
      imageUrl: `${process.env.mybackendUrl}/uploads/blog/${req.file.filename}`,
    });
  },
);
export default router;
