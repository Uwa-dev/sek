import mongoose from "mongoose";

const MonthlySalesSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12, // Represents the month (1 = January, 12 = December)
  },
  year: {
    type: Number,
    required: true, // The year of the sales record
  },
  total_sales: {
    type: Number,
    required: true, // The total sales amount for the month in Naira
    default: 0,
  },
});

// Ensure unique month and year combination
MonthlySalesSchema.index({ month: 1, year: 1 }, { unique: true });

const MonthlySales = mongoose.model('MonthlySales', MonthlySalesSchema);

export default MonthlySales;
