import amqplib, { Channel } from "amqplib";

let connection, channel: Channel;
export async function connectQueue(): Promise<Channel> {
  try {
    const rabbitmqurl = process.env.RABBITMQ_URL || "amqp://localhost";
    connection = await amqplib.connect(rabbitmqurl);

    channel = await connection.createChannel();

    // await channel.assertQueue("summariseQueue");

    // await channel.assertQueue("websearchQueue");

    console.log("Connected to RabbitMQ and channel created successfully");
    return channel;
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw new Error("Failed to connect to RabbitMQ");
  }
}

export async function sendDataToSummaryQueue(data: {
  id: string;
  text: string;
  accessToken: string;
}) {
  try {
    // console.log(Buffer.from(JSON.stringify(data)));
    await channel.sendToQueue(
      "summariseQueue",
      Buffer.from(JSON.stringify(data))
    );
    console.log("Data sent to summary worker");
  } catch (error) {
    console.error("Error sending data to summariseQueue:", error);
    throw new Error("Failed to send data to summariseQueue");
  }
}

// async function sendDataToWebSearchQueue(data) {
//   try {
//     // console.log(Buffer.from(JSON.stringify(data)));
//     await channel.sendToQueue(
//       "websearchQueue",
//       Buffer.from(JSON.stringify(data))
//     );
//     console.log("Data sent to web search worker");
//   } catch (error) {
//     console.error("Error sending data to websearchQueue:", error);
//     throw new Error("Failed to send data to websearchQueue");
//   }
// }

// async function summaryWorker() {
//   try {
//     console.log("summary worker started");
//     channel.consume("summariseQueue", async (data) => {
//       if (data !== null) {
//         const { id, text, accessToken } = JSON.parse(data.content.toString());
//         // console.log("Received data for summarization:", text);

//         // Process the data here
//         // For example, you can call a function to summarize the data
//         const summary = await extractInsuranceFields(text);

//         await sendDataToWebSearchQueue({
//           id,
//           summary,
//           accessToken,
//         });

//         // Acknowledge the message
//         channel.ack(data);
//       }
//     });
//   } catch (error) {
//     console.error("Error in summary worker:", error);
//     channel.ack(data);
//   }
// }

// async function websearchWorker() {
//   try {
//     console.log(`websearch worker started`);
//     await channel.consume("websearchQueue", async (data) => {
//       if (data !== null) {
//         const { id, summary, accessToken } = JSON.parse(
//           data.content.toString()
//         );
//         // console.log('Received data for web search:', {id, summary, accessToken});

//         const webSearchResults = await webSearch(summary, accessToken);

//         if (!webSearchResults) {
//           console.error("No web search results found for ID:", id);
//           channel.ack(data);
//           return;
//         }

//         await publisher.publish(
//           CHANNEL,
//           JSON.stringify({
//             task_id: id,
//             result: webSearchResults,
//           })
//         );
//         console.log("Data published from websearch worker");
//         // console.log(`Web search results for ID ${id}:`, webSearchResults);

//         // Acknowledge the message
//         channel.ack(data);
//       }
//     });
//   } catch (error) {
//     console.error("Error in web search worker:", error);
//     channel.ack(data);
//   }
// }

// module.exports = {
// connectQueue,
// sendDataToSummaryQueue,
// sendDataToWebSearchQueue,
// summaryWorker,
// websearchWorker,
// };
