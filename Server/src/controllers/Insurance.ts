// const axios = require("axios");
import axios from "axios";
import { Request, Response } from "express";
// const FormData = require("form-data");
import FormData from "form-data";
// const fs = require("fs");
import fs from "fs";
// const { extractInsuranceFields } = require('../utils/llmproxy');
// const { sendDataToSummaryQueue } = require("../config/queue");
import { sendDataToSummaryQueue } from "../config/queue";
// const { webSearch } = require('../utils/websearch');

interface AlchemystApiResponse {
  text: string;
  [key: string]: any;
}

export async function extractInsurance(req: Request, res: Response) {
  try {
    // Check if file is present
    const insurance = req.files?.file;
    if (!insurance) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if accessToken is present
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ error: "No access token provided" });
    }

    // Prepare form-data
    const form = new FormData();
    form.append("file", fs.createReadStream(insurance.tempFilePath));

    // Send request to Alchemist API
    const response = await axios.post<AlchemystApiResponse>(
      "https://platform-backend.getalchemystai.com/api/v1/upload",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${req.user.accessToken}`,
        },
      }
    );

    if (response) {
      await sendDataToSummaryQueue({
        id: req.user.id,
        text: response.data.text,
        accessToken: req.user.accessToken,
      });
    }
    // Forward the response from Alchemist API
    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
}

// exports.getInsuranceDetails = async(req, res) => {
//     try{
//         if(!req.user.accessToken){
//             return res.status(401).json({ error: 'No access token provided' });
//         }

//         const {insuranceData} = req.body;

//         const response = await extractInsuranceFields(insuranceData);

//         return res.status(200).json({
//             success: true,
//             message: "Got the insurance fields",
//             data: response,
//         })
//     }
//     catch(error){
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             error: error,
//             message: 'Could not get insurance fields',
//         })
//     }
// }

// exports.findSimilarInsurance = async(req, res) => {
//   try {
//     const {summary} = req.body;
//     if (!summary) {
//       return res.status(400).json({ error: 'Summary is required' });
//     }
//     if (!req.user || !req.user.accessToken) {
//       return res.status(401).json({ error: 'No access token provided' });
//     }

//     const webSearchResults = await webSearch(summary, req.user.accessToken);
//     if (!webSearchResults) {
//       return res.status(404).json({ error: 'No similar insurance plans found' });
//     }

//     return res.status(200).json({
//       success: true,
//       data: webSearchResults,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Could not find similar insurance plans',
//     });

//   }
// }
