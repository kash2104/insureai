const { createClient } = require("redis");

const publisher = createClient();
const subscriber = publisher.duplicate();
const CHANNEL = 'similar_insurance';

async function startPubSub(){
    try {
       await publisher.connect();
       await subscriber.connect();
       console.log('Redis Pub/Sub connected successfully'); 
    } catch (error) {
        console.error('Error starting Pub/Sub:', error);
        process.exit(1);
        
    }
}


module.exports = {publisher, subscriber, CHANNEL, startPubSub};