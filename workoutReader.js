`
Create CSV Reader Function(s)

In the workoutReader.js file, create a script that:

    Uses the csv-parser package to read CSV workout data asynchronously
    Counts the total number of workouts in the CSV file
    Calculates total workout minutes in the CSV file using a basic for loop
    Handles errors when the CSV file is missing or corrupted
    Provides clear error messages to users
 `   
const fs = require("fs");
const csv = require("csv-parser");
async function usersworkoutCalculator(filePath) {
  return new Promise((resolve, reject) => {
    let totalWorkouts = 0;
    let totalDuration = 0;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        totalWorkouts++;
        totalDuration += parseInt(row.duration, 10);
      })
      .on("end", () => {
        console.log(`Total workouts: ${totalWorkouts}`);
        console.log(`Total minutes: ${totalDuration}`);
        resolve({ totalWorkouts, totalDuration });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
usersworkoutCalculator("./data/workouts.csv")
// Total workouts: 10 
// Total minutes: 330 
module.exports = { usersworkoutCalculator };