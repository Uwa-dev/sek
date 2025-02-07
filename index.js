import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './dbConnection.js';

dotenv.config()
const app = express();
const port = process.env.PORT;
connectDB()

app.use(express.json);
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());



app.listen(port, () => {
  console.log(`Server is listening to port ${port}`)
})