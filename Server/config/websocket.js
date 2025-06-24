const { WebSocket } = require("ws");
const { subscriber, CHANNEL } = require("./pubsub");


const taskSubscriptions = new Map();

function setupWebSocket(wss){
    wss.on('connection', function connection(ws){
        ws.on('error', console.error);

        ws.on('message', function message(msg) {
            try {
                const data = JSON.parse(msg);
                // console.log('Received message:', data);

                // Here you can handle the received message
                if(data.action === 'subscribe' && data.task_id){
                    const taskId = data.task_id;

                    if (!taskSubscriptions.has(taskId)) {
                        taskSubscriptions.set(taskId, new Set());
                    }
                    taskSubscriptions.get(taskId).add(ws);
                    // console.log(`Client subscribed to task ID: ${taskId}`);
                }
                
            } catch (error) {
                console.error('Error processing websocket message:', error);
            }
        });

        ws.on('close', () => {
            for(const clients of taskSubscriptions.values()) {
                clients.delete(ws);
            }
            console.log('Client disconnected');
        })

        // ws.send('Welcome to the WebSocket server!');
    })


    subscriber.subscribe(CHANNEL, (message) => {
        try {
            const data = JSON.parse(message);
            const {task_id, result} = data;

            const clients = taskSubscriptions.get(task_id);
            if(clients){
                for(const client of clients){
                    if(client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            task_id: task_id,
                            result: result
                        }));
                        // console.log(`Sent result for task ID ${task_id} to client`);
                    }
                }
                taskSubscriptions.delete(task_id); // Clear subscription after sending result
            }
        } catch (error) {
            console.error('Error processing message from Redis:', error);
        }
    })
}

module.exports = { setupWebSocket };

