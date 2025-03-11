import express from 'express';
import {listProducts, addProduct, removeProduct } from '../controllers/productController.js'
// import multer from 'multer';
import upload from '../middleware/upload.js'
const productRouter = express.Router();


productRouter.get("/list",listProducts);
productRouter.post("/add",upload.single('image'),addProduct);
productRouter.post("/remove",removeProduct);


export default productRouter;
