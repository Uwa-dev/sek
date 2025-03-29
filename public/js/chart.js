const ctx = document.getElementById('salesChart').getContext('2d');

// Function to fetch sales data
async function fetchSalesData() {
  try {
    const response = await fetch("/api/sales"); // Adjust the route if needed
    const result = await response.json();

    if (result.success) {
      return result.data; // Sales data for 12 months
    } else {
      console.error("Failed to fetch sales data:", result.message);
      return Array(12).fill(0); // Return an array of zeros on error
    }
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return Array(12).fill(0); // Return an array of zeros on error
  }
}

// Function to initialize the chart
async function initializeChart() {
  const salesData = await fetchSalesData();

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      datasets: [{
        label: "Total Sales (#)",
        data: salesData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Months",
          }
        },
        y: {
          title: {
            display: true,
            text: "Sales (#)",
          },
          beginAtZero: true,
        }
      }
    }
  });
}

// Initialize the chart
initializeChart();
