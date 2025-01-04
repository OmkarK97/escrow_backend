const express = require("express");
const cors = require("cors");
const app = express();

// Routes
const userRoutes = require("./routes/user");
const deedRoutes = require("./routes/deed");
const disputeRoutes = require("./routes/dispute");
const logRoutes = require("./routes/log");
const workRoutes = require("./routes/work");
const faqRoutes = require("./routes/faq");
const suggestionRoutes = require("./routes/suggestion");

// Middleware
app.use(cors()) // Enable CORS
app.use(express.json()); // For parsing JSON requests

// API Endpoints
app.use("/user", userRoutes); // User routes
app.use("/deed", deedRoutes); // Deed routes
app.use("/dispute", disputeRoutes); // Dispute routes
app.use("/log", logRoutes); // Log routes
app.use("/work", workRoutes); // Work routes
app.use("/faq", faqRoutes); // FAQ routes
app.use("/suggestion", suggestionRoutes); // Suggestion routes

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Escrow Backend Server"); // Simple message on home route
});

// Server Configuration
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); // Log the port the server is running on
});
