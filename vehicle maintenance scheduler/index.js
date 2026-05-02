
const express = require("express");
const loggingMiddleware = require("./logging_middleware/middleware");
const schedulerRoutes = require("./vehicle_maintenance_scheduler/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggingMiddleware);

app.use("/api", schedulerRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend server is running",
    endpoints: {
      health: "/health",
      externalAPIs: {
        depots: "GET http://20.207.122.201/evaluation-service/depots",
        vehicles: "GET http://20.207.122.201/evaluation-service/vehicles",
      },
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /api/depots - Get all depots`);
  console.log(`  GET  /api/vehicles - Get all vehicles`);
  console.log(`  POST /api/schedule - Get optimal repair schedule`);
  console.log(`  GET  /api/schedule - Get optimal repair schedule (query params)`);
  console.log(`\nExternal APIs (called with Bearer token):`);
  console.log(`  GET http://20.207.122.201/evaluation-service/depots`);
  console.log(`  GET http://20.207.122.201/evaluation-service/vehicles`);
});


module.exports = app;
