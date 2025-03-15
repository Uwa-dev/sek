import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './backend/dbConnection.js';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
// import upload from './backend/middleware/upload.js'
import userRouter from './backend/routes/userRoutes.js';
import productRouter from './backend/routes/productRoutes.js';
import paymentRouter from './backend/routes/paymentRoutes.js'

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
app.use("/api/payment", paymentRouter)
app.use("/images",express.static('uploads'))

//render paystack html file
app.get('/paystack', function(req, res) {
  // const https = require('https')
  

  const params = JSON.stringify({
    "email": "customer@email.com",
    "amount": "20000"
  })

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  const reqpastack = https.request(options, respaystack => {
    let data = ''

    respaystack.on('data', (chunk) => {
      data += chunk
    });

    respaystack.on('end', () => {
      res.send(data)
      console.log(JSON.parse(data))
    })
  }).on('error', error => {
    console.error(error)
  })

  reqpastack.write(params)
  reqpastack.end()
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
