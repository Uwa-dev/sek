import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './backend/dbConnection.js';
import path from 'path';
import { fileURLToPath } from 'url';
// import upload from './backend/middleware/upload.js'
import userRouter from './backend/routes/userRoutes.js';
import productRouter from './backend/routes/productRoutes.js';


// Configure environment variables
dotenv.config();

// Create __dirname equivalent in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const port = process.env.PORT;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend URL
  credentials: "include", // Include credentials in requests
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/api/user", userRouter);
app.use("/api/products", productRouter)
app.use("/images",express.static('uploads'))


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
