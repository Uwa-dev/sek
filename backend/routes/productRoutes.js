import express from 'express';
import {listProducts, addProduct, removeProduct, updateProductPrice} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const productRouter = express.Router();


productRouter.get("/list",listProducts);
productRouter.post("/add", upload.single('image'),addProduct);
productRouter.post("/remove", removeProduct);
productRouter.post("/update-price", updateProductPrice);


export default productRouter;
