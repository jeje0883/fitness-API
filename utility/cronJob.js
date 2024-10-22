// cronJob.js

const cron = require('node-cron');
const axios = require('axios');

// Define the cron job function
function startCronJob(serverUrl) {
    // Cron job to run every 13 minutes
    cron.schedule('*/13 * * * *', async () => {
        console.log('Pinging the server to keep it awake...');
        try {
            await axios.get(serverUrl);  // Ping the provided server URL
            console.log('Server pinged successfully');
        } catch (error) {
            console.error('Error pinging the server:', error);
        }
    });

    console.log('Cron job scheduled to run every 13 minutes');
}

// Export the function as a module
module.exports = {
    startCronJob
};
