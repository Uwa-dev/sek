import MonthlySales from '../models/totalSales.js'

// Function to update monthly sales
async function updateMonthlySales(orderAmount, orderDate) {
  const month = orderDate.getMonth() + 1; // Get month (1-12)
  const year = orderDate.getFullYear(); // Get year

  try {
    // Find existing record for the month
    let salesRecord = await MonthlySales.findOne({ month, year });

    if (salesRecord) {
      // Update total sales
      salesRecord.total_sales += orderAmount;
      await salesRecord.save();
    } else {
      // Create new record
      await MonthlySales.create({
        month,
        year,
        total_sales: orderAmount,
      });
    }
  } catch (error) {
    console.error('Error updating monthly sales:', error);
    throw error; // Re-throw the error for higher-level handling
  }
}
export default updateMonthlySales
