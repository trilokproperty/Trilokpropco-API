import { categoryModel } from "../Models/BlogCategoryModel.js";

// add blog category
export const addBlogCategory = async(req, res)=>{
    try{
        const blogCategory = new categoryModel({category: req.body.category})
        const savedBlogCategory = await blogCategory.save();
        res.status(200).json(savedBlogCategory)
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({message: "Internal Serval Error."})
    }
}

// get blog categories
export const getBlogCategories = async (req, res) =>{
    try{
      const categories = await categoryModel.find();
      res.status(200).json(categories)
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});

}}

// delete blog category with id:
export const deleteBlogCategory = async(req, res)=>{
    const id = req.params.id;
    try{
    const category = await categoryModel.findByIdAndDelete(id);
    if(!category){
        req.status(404).json({message: "Category not found"})
    }
    res.json({message: "deleted category"})
    }catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Internal Server Error."});
}
}