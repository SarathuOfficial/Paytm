// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');
const router = express.Router();


// Middleware to authenticate token for the balance route
const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader; // Extract token directly from Authorization header

    if (!token) return res.sendStatus(401); // If token is not provided, send 401 Unauthorized status

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // If token is invalid, send 403 Forbidden status
        req.user = decoded; // Set user object in the request object
        next(); // Move to the next middleware or route handler
    });
};

router.get("/balance", authenticateToken, async (req, res) => {
    try {
       
        const account = await Account.findOne({ userId: req.user.userId }); // Change req.user.id to req.user.userId
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;