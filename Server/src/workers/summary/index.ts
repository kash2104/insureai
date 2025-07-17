require("dotenv").config({ path: "../../.env" });
import { HumanMessage } from "@langchain/core/messages";
import { connectQueue } from "../../config/queue";
import { lcClientWithProxy } from "../../utils/llmproxy";
import { Channel } from "amqplib";

async function extractInsuranceFields(rawText: string): Promise<string> {
  try {
    const prompt = `
  You are an expert in reading and analyzing health insurance policies.
  
  Your task is to extract a summary paragraph of the most essential details **including exact monetary values wherever they are mentioned**. If any detail like coverage amount or premium is not clearly available in the input, say "Not specified".
  
  From the text below, include these in your paragraph:
  
  - Type of insurance (e.g., health, family floater)
  - Provider name
  - Exact coverage amount (e.g., ₹10,00,000)
  - Annual or monthly premium (e.g., ₹12,000/year)
  - Tenure (e.g., 1 year, renewable)
  - Key inclusions (hospitalization, ICU, maternity, daycare, etc.)
  - Key exclusions (pre-existing, cosmetic, dental, etc.)
  - Add-ons or riders (if any)
  - Co-pay % (if any)
  - Room rent limit (if any)
  - Eligibility (age, tests)
  - Claims process type (cashless/reimbursement)
  
  Ensure the result is **a single paragraph**, concise, and readable. Use numerical values (e.g., ₹ or INR) when available.
  
  Text:
  """
  ${rawText}
  """
  `;

    const response = await lcClientWithProxy.invoke([new HumanMessage(prompt)]);
    // console.log(response);
    return response.content?.toString().trim();
  } catch (error) {
    console.error("Error in extractInsuranceFields:", error);
    throw new Error("Failed to extract insurance fields");
  }
}

async function sendDataToWebSearchQueue(
  data: { id: string; summary: string; accessToken: string },
  channel: Channel
) {
  try {
    // console.log(Buffer.from(JSON.stringify(data)));
    channel.sendToQueue("websearchQueue", Buffer.from(JSON.stringify(data)));
    console.log("Data sent to web search worker");
  } catch (error) {
    console.error("Error sending data to websearchQueue:", error);
    throw new Error("Failed to send data to websearchQueue");
  }
}

async function summaryWorker() {
  try {
    const channel = await connectQueue();
    await channel.assertQueue("summariseQueue");

    console.log("Summary worker started");

    await channel.consume("summariseQueue", async (data) => {
      if (data !== null) {
        try {
          const { id, text, accessToken } = JSON.parse(data.content.toString());
          // console.log("Received data for summarization:", text);

          // Process the data here
          // For example, you can call a function to summarize the data
          const summary = await extractInsuranceFields(text);

          await sendDataToWebSearchQueue(
            {
              id,
              summary,
              accessToken,
            },
            channel
          );

          // Acknowledge the message
          channel.ack(data);
        } catch (error) {
          console.error("Error processing message in summary worker:", error);
          channel.ack(data);
        }
      }
    });
  } catch (error) {
    console.error("Failed to start summary worker:", error);
    process.exit(1);
  }
}

summaryWorker();
