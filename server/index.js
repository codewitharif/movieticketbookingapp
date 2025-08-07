// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const { clerkMiddleware } = require("@clerk/express");
const { inngest, functions } = require("./inngest/index");
const { serve } = require("inngest/express");
const { stripeWebhhoks } = require("./controllers/stripeWebhooks");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(clerkMiddleware());
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhhoks
);
// Important: Raw body parsing for webhooks BEFORE express.json()
// app.use("/webhooks", express.raw({ type: "application/json" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("movie booking API server Running 🚀");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
