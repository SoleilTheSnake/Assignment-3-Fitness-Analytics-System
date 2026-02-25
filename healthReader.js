const fs = require("fs").promises;

async function healthMetricsCounter(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");

    if (!data.trim()) {
      throw new Error("File is empty.");
    }

    const parsedData = JSON.parse(data);

    if (!parsedData.metrics || !Array.isArray(parsedData.metrics)) {
      throw new Error("Invalid format: 'metrics' array not found.");
    }

    const totalEntries = parsedData.metrics.length;

    console.log(`Total health entries: ${totalEntries}`);
    return totalEntries;

  } catch (error) { // Helps me find what's breaking the code and gives me a better understanding of the error
    if (error.code === "ENOENT") {
      console.error("Error: File not found.");
    } else if (error instanceof SyntaxError) {
      console.error("Error: Invalid JSON format.");
    } else {
      console.error("Error:", error.message);
    }
  }
}

healthMetricsCounter("./data/health-metrics.json");
// Total health entries: 8 
module.exports = { healthMetricsCounter };