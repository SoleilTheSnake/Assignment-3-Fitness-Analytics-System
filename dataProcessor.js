require('dotenv').config({ path: require('path').join(__dirname, 'userData.env') 
});

const { healthMetricsCounter } = require('./healthReader');
const { usersworkoutCalculator } = require('./workoutReader');

async function displaySummary() {
  try {
    // Validate environment variables first
    if (!process.env.USER_NAME || !process.env.WEEKLY_GOAL) {
      throw new Error("Missing USER_NAME or WEEKLY_GOAL in .env file.");
    }

    const weeklyGoal = parseInt(process.env.WEEKLY_GOAL, 10);

    if (isNaN(weeklyGoal)) {
      throw new Error("WEEKLY_GOAL must be a valid number.");
    }

    // Call external async functions

    const workoutData = await usersworkoutCalculator("./data/workouts.csv");
    const healthEntries = await healthMetricsCounter("./data/health-metrics.json");

    console.log(`\nHello, ${process.env.USER_NAME}! Here is your fitness summary:\n`);

    console.log(`Health entries recorded: ${healthEntries}`);
    console.log(`Total workouts completed: ${workoutData.totalWorkouts}`);
    console.log(`Total workout minutes: ${workoutData.totalDuration}`);

    const remaining = weeklyGoal - workoutData.totalDuration;

    if (workoutData.totalDuration >= weeklyGoal) {
      console.log("\n Congratulations! You've met your weekly workout goal!");
    } else {
      console.log(`\n Keep going! You need ${remaining} more minutes to reach your goal.`);
    }

  } catch (error) {
    console.error("\nUnable to generate fitness summary.");
    console.error("Reason:", error.message);
  }
}

displaySummary();