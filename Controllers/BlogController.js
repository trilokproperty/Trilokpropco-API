import { blogModel } from "../Models/BlogModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// add Blog controller:
export const addBlog = async (req, res) => {
    try {
        let imageResult;
        console.log(req.file)
        if (req.file) {
            imageResult = await cloudinary.uploader.upload(req.file.path);
        }
        const allFields = {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            image: imageResult ? imageResult.secure_url : undefined,
            date: req.body.date,
            imagePublicId: imageResult ? imageResult.public_id : undefined
        };
        const blog = new blogModel(allFields);
        const savedBlog = await blog.save();
        res.status(200).json(savedBlog);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// get Blogs controller:
export const getBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find();
        res.status(200).json(blogs);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// get Single Blog controller:
export const getSingleBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }
        res.status(200).json(blog);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// update Blog
export const updateBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(400).json({ message: "Blog not found." });
        }

        let imageResult;
        console.log(req.file)
        if (req.file) {
            // Upload new image if present
            imageResult = await cloudinary.uploader.upload(req.file.path);
            // Delete old image from Cloudinary
            if (blog.imagePublicId) {
                await cloudinary.uploader.destroy(blog.imagePublicId);
            }
        }

        const updatedFields = {
            category: req.body.category || blog.category,
            title: req.body.title || blog.title,
            description: req.body.description || blog.description,
            image: imageResult ? imageResult.secure_url : blog.image,
            date: req.body.date || blog.date,
            imagePublicId: imageResult ? imageResult.public_id : blog.imagePublicId
        };

        const updatedBlog = await blogModel.findByIdAndUpdate(id, updatedFields, { new: true });
        res.status(200).json(updatedBlog);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

// delete Blog controller:
export const deleteBlog = async (req, res) => {
    const id = req.params.id;
    console.log("Deleting blog with ID:", id);
    try {
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        // Delete image from Cloudinary
        if (blog.imagePublicId) {
            await cloudinary.uploader.destroy(blog.imagePublicId);
        }

        await blogModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog successfully deleted." });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
