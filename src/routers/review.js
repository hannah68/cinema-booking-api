const express = require("express");
const { createReview } = require('../controllers/review');

const router = express.Router({ mergeParams: true });

router.post("/", createReview);


module.exports = router;