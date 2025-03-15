import productModel from '../models/productModel.js'
import Product from '../models/productModel.js'
import fs from 'fs'

// all products list
const listProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, data: products })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add product
const addProduct = async (req, res) => {
    
    // let image_filename = `${req.file.filename}`
    let image_filename = req.file ? `${req.file.filename}` : null;

    const { productName, price, category } = req.body;

    // Ensure an image file was uploaded
    if (!image_filename) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }

    if (!productName || !price || !category || !image_filename) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
    
    const product = new Product({
        productName: req.body.productName,
        price: req.body.price,
        category:req.body.category,
        image: image_filename,
    })
    try {

        // Create a new Product, mapping 'productName' to 'name'
        const product = new Product({
            name: productName, // Map 'productName' to 'name'
            price,
            image: image_filename, 
            category,
        });

         // Check if the user already exists
         const exists = await productModel.findOne({name: productName});
         if (exists) {
         return res.status(409).json({ success: false, message: 'Product already exists' });
         }

        await product.save();
        res.json({ success: true, message: "Product Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete product
const removeProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.body.id);
        fs.unlink(`uploads/${product.image}`, () => { })

        await Product.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

export { listProducts, addProduct, removeProduct }