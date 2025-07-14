const { createClient } = require("redis");

const redisurl = process.env.REDIS_URL || "redis://localhost:6379";
// const publisher = createClient({url: redisurl});
const subscriber = createClient({ url: redisurl });
const CHANNEL = "similar_insurance";

async function startPubSub() {
  try {
    // await publisher.connect();
    await subscriber.connect();
    console.log("Redis Pub/Sub connected successfully");
  } catch (error) {
    console.error("Error starting Pub/Sub:", error);
    process.exit(1);
  }
}

module.exports = { subscriber, CHANNEL, startPubSub };
