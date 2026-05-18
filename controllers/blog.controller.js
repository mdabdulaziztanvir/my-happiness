import path from "path";
import { Blog } from "../models/blog.js";
import { User } from "../models/UserModel.js";
import fs from "fs";
import multer from "multer";

const blogMainFolder = "./public/uploads/blog";

if (!fs.existsSync(blogMainFolder)) {
  fs.mkdir(blogMainFolder, { recursive: true }, (err) => {
    if (err) throw err;
    console.log("dir created blog");
  });
}

const blogImageStorage = multer.diskStorage({
  destination: "./public/uploads/blog",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const thumbnailStorage = multer.diskStorage({
  destination: "./public/uploads/blog",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const thumbnailUpload = multer({ storage: thumbnailStorage });

export const blogImageUpload = multer({ storage: blogImageStorage });

function improveSlug(sluga) {
  const higphendSlug = sluga.trim().replaceAll(" ", "-");
  return higphendSlug;
}

export const createBlog = async (req, res) => {
  const { title, content, slug, thumbnail, isPublished } = req.body;
  const id = req.id;
  // console.log(req.body);
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(400).json({ message: "you are not a valid user." });
    const improvedSlug = improveSlug(slug);
    const isNotUniqueSlug = await Blog.findOne({
      where: { slug: improvedSlug },
    });
    if (isNotUniqueSlug)
      return res
        .status(400)
        .json({ message: "The slug/url already used. Try a unique one..." });

    // const aaa = `${blogMainFolder}/${improvedSlug}`;
    // fs.mkdir(aaa, { recursive: true }, (err) => {
    //   throw err;
    //   console.log("create");
    // });
    const blogData = await Blog.create({
      title,
      content,
      authorId: id,
      slug: improvedSlug,
      thumbnail,
      isPublished,
    });

    return res.json({ blogData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error creating Blog", error: error });
  }
};

// get all blogs for user filter published
export const getAllBlogsPublic = async (req, res) => {
  try {
    const publicBlog = await Blog.findAll({
      where: { isPublished: true },
      attributes: ["title", "slug", "thumbnail", "authorId", "id"],
      order: [["id", "DESC"]],
    });
    if (!publicBlog)
      return res.status(400).json({ message: "No Blog Has been created" });
    return res
      .status(200)
      .json({ message: "Here Is all Blogs", Blogs: publicBlog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting all Blogs", error: error.message });
  }
};
// for super admin
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    if (!blogs)
      return res.status(400).json({ message: "No Blog Has been created" });

    return res.status(200).json({ message: "Here Is all Blogs", Blogs: blogs });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting all Blogs", error: error.message });
  }
};
//
export const getAllBlogsForSingleAdmin = async (req, res) => {
  const id = req.id;
  try {
    const singleAdminBlog = await Blog.findAll({ where: { authorId: id } });
    return res.status(400).json({ message: "you do not have any blogs" });
    const blogs = await Blog.findAll();
    if (!blogs)
      return res.status(400).json({ message: "No Blog Has been created" });

    return res.status(200).json({
      message: "Here Is all Blogs",
      SingleAdminBlogs: singleAdminBlog,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting all Blogs", error: error.message });
  }
};

// get single blog for admin for updating without published and unpublished all
export const singleBlogAdmin = async (req, res) => {
  const { slug } = req.params;
  try {
    const singleVlog = await Blog.findOne({ where: { slug } });
    if (!singleVlog)
      return res
        .status(400)
        .json({ message: "No Blog Has been created with this slug" });
    return res
      .status(200)
      .json({ message: "Here Is the Blog", Blog: singleVlog });
  } catch (error) {
    return res.status(500).json({
      message: `error getting blog with the slug ${slug}`,
      error: error.message,
    });
  }
};

export const updateSingleBlogAdmin = async (req, res) => {
  const id = req.id;
  const { slug } = req.params;
  const {
    title,
    content,
    slug: newSlugInput,
    thumbnail,
    isPublished,
  } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(400).json({ message: "you are not a user" });

    const blog = await Blog.findOne({ where: { slug } });
    if (!blog)
      return res.status(400).json({ message: "url/slug in not valid" });
    const newSlug = improveSlug(newSlugInput);

    blog.title = title ? title : blog.title;
    blog.content = content ? content : blog.content;
    blog.slug = newSlug ? newSlug : blog.slug;
    blog.thumbnail = thumbnail ? thumbnail : blog.thumbnail;
    if (isPublished === "boolean") {
      blog.isPublished = isPublished ? isPublished : blog.isPublished;
    }
    blog.authorId = id;

    await blog.save();

    return res.status(200).json({ message: `${slug} has been updated`, blog });
  } catch (error) {
    return res.status(500).json({
      message: `error updating slug`,
      error: error.message,
    });
  }
};

// get single blog for only user published

export const singleBlogPublic = async (req, res) => {
  const { slug } = req.params;
  try {
    const singleVlog = await Blog.findOne({
      where: { slug, isPublished: true },
    });
    if (!singleVlog)
      return res
        .status(400)
        .json({ message: "No Published Blog Has been created with this slug" });
    return res
      .status(200)
      .json({ message: "Here Is the Blog", Blog: singleVlog });
  } catch (error) {
    return res.status(500).json({
      message: `error getting blog with the slug ${slug}`,
      error: error.message,
    });
  }
};
// delete a blog
export const deleteBlogByAdmin = async (req, res) => {
  const { slug } = req.params;
  const id = req.id;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(400).json({ message: "you are not a user" });

    const blog = await Blog.findOne({ where: { slug, authorId: id } });
    if (!blog)
      return res.status(400).json({ message: "url/slug in not valid" });

    await blog.destroy();
    return res.status(200).json({ message: `${slug} has been deleted` });
  } catch (error) {
    return res.status(500).json({
      message: `error deleting blog with the slug ${slug}`,
      error: error.message,
    });
  }
};
