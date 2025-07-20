import { createBlogs, getAllBlogs, getBlog, updateBlogs, publishBlog, getBlogByPublicPath } from "../controllers/blogController";

const router = require("express").Router();

router.get("/" , getAllBlogs);
router.route("/").post(createBlogs);
router.route('/:id').put(updateBlogs).get(getBlog);
router.put('/:id/publish', publishBlog);
router.get('/public/:author/:topic', getBlogByPublicPath);

export default router;