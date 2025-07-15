// const express = require("express");
import express from "express";
const router = express.Router();

// const {
//   extractInsurance,
//   //   getInsuranceDetails,
//   //   findSimilarInsurance,
// } = require("../controllers/Insurance");
import { extractInsurance } from "../controllers/Insurance";
// const { auth } = require("../middlewares/auth");
import { auth } from "../middlewares/auth";

router.post("/extract", auth, extractInsurance);

// router.post('/insurance', auth, getInsuranceDetails);

// router.post('/similarInsurance', auth, findSimilarInsurance);

export default router;
