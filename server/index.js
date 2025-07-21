// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const { clerkWebhooks } = require("./controllers/webhooks");
// const companyRoutes = require("./routes/companyRoutes");
// const userRoutes = require("./routes/userRoutes");
// const jobRoutes = require("./routes/jobRoutes");
// const connectCloudinary = require("./config/cloudinary");
const { clerkMiddleware } = require("@clerk/express");
const { inngest, functions } = require("./inngest/index");
const { serve } = require("inngest/express");
 
dotenv.config();
connectDB();
// connectCloudinary();

const app = express();

// Middleware
app.use(cors());
app.use(clerkMiddleware());
// Important: Raw body parsing for webhooks BEFORE express.json()
// app.use("/webhooks", express.raw({ type: "application/json" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("movie booking API server Running 🚀");
});

app.use("/api/inngest",serve({client:inngest, functions}))

// app.post("/webhooks", clerkWebhooks);
// app.use("/api/company", companyRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
