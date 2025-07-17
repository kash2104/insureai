import express from "express";
const router = express.Router();

import { extractInsurance } from "../controllers/Insurance";
import { auth } from "../middlewares/auth";

router.post("/extract", auth, extractInsurance);

// router.post('/insurance', auth, getInsuranceDetails);

// router.post('/similarInsurance', auth, findSimilarInsurance);

export default router;
