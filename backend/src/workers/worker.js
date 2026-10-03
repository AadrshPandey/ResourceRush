import {Worker} from 'bullmq';
import 'dotenv/config';
import {myConnection} from '../cacheInit/queue.js';
import {pool} from '../dbInit/db.js';

console.log("Worker is running...");

const worker = new Worker('audit_logs', async (job) => {
    const {ip, status} = job.data;
    const arrivalTime = job.data.arrivalTime ?? job.data.currentTime;

    if (ip === undefined || status === undefined || arrivalTime === undefined) {
        throw new Error('Invalid audit job data: expected ip, status, and arrivalTime.');
    }

    const query = `INSERT INTO customerDetails (ip, status, arrivalTime) VALUES (?, ?, ?)`;

    try{
        await pool.execute(query, [ip, status, arrivalTime]);
        console.log("Data inserted into database successfully.");
    }
    catch(err){
        console.error("Error inserting data into database: ", err);
        throw err;
    }
},
{
    connection: myConnection,
    concurrency: 50, // Number of concurrent jobs to process
}
);

worker.on('error', (err) => {
    console.log('Worker error: ', err);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
});