import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import chatRoute from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);

app.get("/", (req, res) => {
    res.json({ status: "Server is running!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});