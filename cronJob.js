const cron = require('node-cron');
const { exec } = require('child_process');

cron.schedule('0 0 * * *', () => {
    console.log('Running archive job at midnight');
    exec('node archiveChats.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing archiveChats.js: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
        if (stderr) {
            console.error(`Error output: ${stderr}`);
        }
    });
});

console.log('Cron job scheduled');
