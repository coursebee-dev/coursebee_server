const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const SubCategory = new Schema({
    name: {
        type: String,
    },
})

const Category = new Schema({
    title: {
        type: String,
        required: true
    },
    subcategory: [SubCategory]
})

const CategoryModel = mongoose.model("Category", Category);
const SubCategoryModel = mongoose.model("SubCategory", SubCategory);

module.exports = { CategoryModel: CategoryModel, SubCategoryModel: SubCategoryModel }