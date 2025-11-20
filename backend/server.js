import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

// Connect DB
connectDB();

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});