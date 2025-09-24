import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./Routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();

//midlleware
app.use(
    cors({
        origin:"http://localhost:5173",
    })
);
app.use(express.json()); // this middleware will parse json bodies: req.body
app.use(rateLimiter);


app.use("/api/notes", notesRoutes);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on PORT: ", PORT);
    });
})