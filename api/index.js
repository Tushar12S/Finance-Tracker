require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const Transaction = require('./models/Transaction.js');

const app = express();

// ✅ Connect to MongoDB ONCE at startup
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Enable CORS
app.use(cors({
    origin: "http://localhost:3000", // Use correct frontend URL
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));
app.use(express.json());

// ✅ Test API
app.get('/api/test', (req, res) => {
    res.json('test ok');
});

// ✅ Add Transaction Route
app.post('/api/transaction', async (req, res) => {
    try {
        const { name, description, datetime, price } = req.body;
        if (!name || !description || !datetime || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const transaction = await Transaction.create({ name, description, datetime, price });
        res.json(transaction);
    } catch (error) {
        console.error("❌ Error saving transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get All Transactions Route
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error("❌ Error retrieving transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start Server
const PORT = 4040;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
