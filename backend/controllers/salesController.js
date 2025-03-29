import MonthlySales from "../models/totalSales.js";
import Order from "../models/order.js";

export const getMonthlySales = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlySales = Array(12).fill(0);

    // Fetch orders for the current year
    const orders = await Order.find({ createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) } });

    // Aggregate sales per month
    orders.forEach(order => {
      const orderMonth = new Date(order.createdAt).getMonth(); // 0-indexed
      monthlySales[orderMonth] += order.amount;
    });

    res.status(200).json({
      success: true,
      data: monthlySales,
    });
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly sales.",
    });
  }
};

export const yearlyOverview = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Fetch all orders from the current year
    const orders = await Order.find({
      createdAt: { 
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`), 
        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
      }
    });

    // Calculate total revenue
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);

    // Calculate total items sold
    const totalItemsSold = orders.reduce((count, order) => {
      return count + order.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);

    res.json({ success: true, totalSales, totalItemsSold });
  } catch (error) {
    console.error("Error fetching yearly overview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const monthlyOverview = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-based index for months

    const startOfMonth = new Date(currentYear, currentMonth, 1); // Start of the current month
    const endOfMonth = new Date(currentYear, currentMonth + 1, 1); // Start of the next month

    // Fetch all orders for the current month
    const orders = await Order.find({
      createdAt: { 
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    // Calculate total revenue
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);

    // Calculate total items sold
    const totalItemsSold = orders.reduce((count, order) => {
      return count + order.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);

    res.json({ success: true, totalSales, totalItemsSold });
  } catch (error) {
    console.error("Error fetching monthly overview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

