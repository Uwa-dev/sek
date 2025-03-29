import express from "express";
import { getMonthlySales, yearlyOverview, monthlyOverview} from "../controllers/salesController.js";

const salesRouter = express.Router();

salesRouter.get("/", getMonthlySales);
salesRouter.get('/yearly-overview', yearlyOverview);
salesRouter.get('/monthly-overview', monthlyOverview);


export default salesRouter;
