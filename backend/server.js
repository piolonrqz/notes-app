// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import statusRoutes from "./routes/statusRoutes.js"; // ✅ NEW
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Connect DB
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api/status", statusRoutes); // ✅ NEW

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    ok: false, 
    error: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    ok: false, 
    error: err.message || 'Internal server error' 
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`=================================================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Network: ${process.env.NETWORK || 'development'}`);
});