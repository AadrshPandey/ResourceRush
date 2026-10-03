import { Queue } from "bullmq";

const myConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
};

const queue = new Queue("audit_logs", {
  connection: myConnection,
});

queue.on("error", (err) => {
    console.log("Queue Client Error : ", err);
});

export { queue, myConnection };