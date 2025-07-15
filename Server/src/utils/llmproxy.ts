// require("dotenv").config();
// const { HumanMessage } = require("@langchain/core/messages");

// const { ChatOpenAI } = require("@langchain/openai");
require("dotenv").config();
import { ChatOpenAI } from "@langchain/openai";

export const lcClientWithProxy = new ChatOpenAI({
  apiKey: process.env.ALCHEMYST_API_KEY,
  model: "alchemyst-ai/alchemyst-c1",
  configuration: {
    baseURL: "https://platform-backend.getalchemystai.com/api/v1/proxy/default",
  },
});

// async function extractInsuranceFields(rawText) {
//   try {
//     const prompt = `
//   You are an expert in reading and analyzing health insurance policies.

//   Your task is to extract a summary paragraph of the most essential details **including exact monetary values wherever they are mentioned**. If any detail like coverage amount or premium is not clearly available in the input, say "Not specified".

//   From the text below, include these in your paragraph:

//   - Type of insurance (e.g., health, family floater)
//   - Provider name
//   - Exact coverage amount (e.g., ₹10,00,000)
//   - Annual or monthly premium (e.g., ₹12,000/year)
//   - Tenure (e.g., 1 year, renewable)
//   - Key inclusions (hospitalization, ICU, maternity, daycare, etc.)
//   - Key exclusions (pre-existing, cosmetic, dental, etc.)
//   - Add-ons or riders (if any)
//   - Co-pay % (if any)
//   - Room rent limit (if any)
//   - Eligibility (age, tests)
//   - Claims process type (cashless/reimbursement)

//   Ensure the result is **a single paragraph**, concise, and readable. Use numerical values (e.g., ₹ or INR) when available.

//   Text:
//   """
//   ${rawText}
//   """
//   `;

//     const response = await lcClientWithProxy.invoke([
//       new HumanMessage(prompt)
//     ]);
//     // console.log(response);
//     return response.content.trim();

//   } catch (error) {
//     console.error("Error in extractInsuranceFields:", error);
//     throw new Error("Failed to extract insurance fields");

//   }

// }

// module.exports = {extractInsuranceFields}

// module.exports = { lcClientWithProxy };
