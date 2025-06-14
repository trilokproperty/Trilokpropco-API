import express from 'express';
import { addBlog, deleteBlog, getBlogs, getSingleBlog, updateBlog,getSingleBlogEdit } from '../Controllers/BlogController.js';
import { upload } from '../MiddleWare/multer.js';
import { verifyAdmin, verifyEditor } from '../MiddleWare/jwt.js';

export const blogRouter = express.Router();

blogRouter.post('/', verifyEditor, upload.single('image'), addBlog)
blogRouter.get('/', getBlogs)
blogRouter.get('/edit/:id', getSingleBlogEdit)
blogRouter.get('/:title', getSingleBlog)
blogRouter.put('/:id', verifyEditor, upload.single('image'), updateBlog)
blogRouter.delete('/:id', verifyAdmin, deleteBlog)
