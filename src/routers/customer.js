const express = require("express");
const {
    createCustomer,
    updateCustomer,
    getCustomers
} = require('../controllers/customer');

const router = express.Router();

router.get("/", getCustomers);
router.post("/register", createCustomer);
router.put("/:id", updateCustomer);


module.exports = router;
