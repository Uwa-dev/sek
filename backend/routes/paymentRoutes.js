import express from "express";
import MonthlySales from "../models/totalSales.js";
import paystack from "paystack-api";
import axios from "axios";
import Order from "../models/order.js";
import dotenv from 'dotenv';
dotenv.config(); 

const paymentRouter = express.Router();
const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY); // Initialize Paystack client

const updateMonthlySales = async (amount) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-indexed month
    const year = now.getFullYear();

    // Find the monthly sales record for this month and year
    const existingSales = await MonthlySales.findOne({ month, year });

    if (existingSales) {
      // Update total sales for the month
      existingSales.total_sales += amount;
      await existingSales.save();
    } else {
      // Create a new entry if no record exists
      await MonthlySales.create({ month, year, total_sales: amount });
    }

    console.log(`Monthly sales updated: ₦${amount} added to ${month}/${year}`);
  } catch (error) {
    console.error("Error updating monthly sales:", error);
  }
};


paymentRouter.post("/", async (req, res) => {
  try {
    const { full_name, email, phone, address, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ status: false, message: "Cart is empty" });
    }

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = 6000;
    const amount = subtotal + shipping;
    const reference = `ref_${Math.random().toString(36).substr(2, 9)}`;

    // Save order to the database
    const newOrder = new Order({
      orderId: reference,
      name: full_name,
      email,
      items: cart,
      amount,
      phone,
      address,
      status: "Pending",
    });

    await newOrder.save();

    await updateMonthlySales(amount);

    // Initialize Paystack transaction
    const response = await paystackClient.transaction.initialize({
      amount: amount * 100,
      email,
      reference,
      metadata: {
        address,
        customerName: full_name,
        phoneNumber: phone,
      },
    });

    res.json({
      status: true,
      data: response.data, // Includes authorization_url
    });
  } catch (error) {
    console.error("Error creating order or initializing payment:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});  

paymentRouter.get('/orders', async (req, res) => {
  try {

    const orders = await Order.find(); // Fetch all orders from the database

    if (!orders || orders.length === 0) {
      return res.status(404).json({ status: false, message: "No orders found" });
    }

    res.status(200).json({ status: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders from the database:", error.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


paymentRouter.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    res.json({
      status: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

paymentRouter.patch('/:orderId/update-status', async(req, res) => {
  try {
      const { orderId } = req.params;
      const { status } = req.body;


      const updatedOrder = await Order.findOneAndUpdate(
          { orderId: orderId },
          { status: status },
          { new: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ status: false, message: "Order not found" });
      }

      res.json({ status: true, order: updatedOrder });
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
  }
})

paymentRouter.get('/sync-paystack-payments', async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/transaction', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const successfulTransactions = response.data.data.filter(
      (transaction) => transaction.status === 'success'
    );

    for (const transaction of successfulTransactions) {
      await Order.findOneAndUpdate(
        { orderId: transaction.reference },
        { status: 'Paid' },
        { new: true }
      );
    }

    res.status(200).json({ message: 'Payments synchronized successfully' });
  } catch (error) {
    console.error('Error synchronizing payments:', error.message);
    res.status(500).json({ error: 'Failed to synchronize payments' });
  }
});


export default paymentRouter;
