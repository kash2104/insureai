const express = require("express");
const router = express.Router();

const {
  extractInsurance,
  //   getInsuranceDetails,
  //   findSimilarInsurance,
} = require("../controllers/Insurance");
const { auth } = require("../middlewares/auth");

router.post("/extract", auth, extractInsurance);

// router.post('/insurance', auth, getInsuranceDetails);

// router.post('/similarInsurance', auth, findSimilarInsurance);

module.exports = router;
