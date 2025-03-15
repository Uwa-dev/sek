import express from "express";
import Payment from '../models/paymentModel.js'; // Import the Payment model
import paystack from "paystack-api"; // Import Paystack client
import dotenv from 'dotenv';
dotenv.config(); 

const paymentRouter = express.Router();
const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY); // Initialize Paystack client


paymentRouter.post("/", async (req, res) => {
  try {
    const { full_name, email, address, cart } = req.body;

    let subtotal = 0;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ status: false, message: "Cart is empty" });
    }
    subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const shipping = 6000;
    const amount = subtotal + shipping;
    const reference = `ref_${Math.random().toString(36).substr(2, 9)}`;

    const newPayment = new Payment({
      full_name,
      email,
      amount,
      address,
      reference,
      status: "pending",
    });
    await newPayment.save();

    // Initialize Paystack transaction
    const response = await paystackClient.transaction.initialize({
      amount: amount * 100,
      email,
      reference,
    });

    res.json({
      status: true,
      data: response.data, // Includes authorization_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

export default paymentRouter;
