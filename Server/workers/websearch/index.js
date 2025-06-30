const { default: axios } = require("axios");
const { connectQueue } = require("../../config/queue");
const { createClient } = require("redis");

const redisurl = process.env.REDIS_URL || "redis://localhost:6379";
const publisher = createClient({ url: redisurl });
const CHANNEL = "similar_insurance";

async function webSearch(summary, accessToken) {
  try {
    const prompt =
      "Given the following summary of a health insurance policy, suggest three similar health insurance plans available for Indian citizens. The alternatives should offer comparable or better benefits and aim for lower or more affordable premiums. Describe each plan in 3-4 well-written sentences, including the provider name, product name, sum insured, important inclusions, co-pay or deductible info if applicable, and any standout features. Do not use bullet points, tables, or headings. Write in a clean and informative paragraph format that can be directly displayed on a user interface.";

    const query = `${summary}`;

    const response = await axios.post(
      "https://platform-backend.getalchemystai.com/api/v1/leads/augment/web",
      {
        userPrompt: prompt,
        dataForSearchQuery: query,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response) {
      throw new Error("No response from web search API");
    }
    // console.log(typeof response.data.lc_kwargs);
    return response.data?.lc_kwargs?.content;
  } catch (error) {
    console.error("Error in webSearch:", error);
    throw new Error("Failed to perform web search");
  }
}

async function websearchWorker() {
  try {
    const channel = await connectQueue();
    await publisher.connect();
    await channel.assertQueue("websearchQueue");
    // try {
    console.log(`websearch worker started`);
    await channel.consume("websearchQueue", async (data) => {
      if (data !== null) {
        try {
          const { id, summary, accessToken } = JSON.parse(
            data.content.toString()
          );
          const webSearchResults = await webSearch(summary, accessToken);

          if (!webSearchResults) {
            console.error("No web search results found for ID:", id);
            channel.ack(data);
            return;
          }

          await publisher.publish(
            CHANNEL,
            JSON.stringify({
              task_id: id,
              result: webSearchResults,
            })
          );
          console.log("Data published from websearch worker");
          // console.log(`Web search results for ID ${id}:`, webSearchResults);

          // Acknowledge the message
          channel.ack(data);
        } catch (error) {
          console.error("Error processing message in websearch worker:", error);
          channel.ack(data);
        }
        // console.log('Received data for web search:', {id, summary, accessToken});
      }
    });
    // } catch (error) {
    //   console.error("Error in web search worker:", error);
    //   channel.ack(data);
    // }
  } catch (error) {
    console.error("Failed to start websearch worker:", error);
    process.exit(1);
  }
}

websearchWorker();
