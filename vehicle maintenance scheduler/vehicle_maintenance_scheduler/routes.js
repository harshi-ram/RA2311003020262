const express = require("express");
const router = express.Router();
const scheduler = require("./scheduler");

router.get("/depots", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split(" ")[1] || "";
    const depots = await scheduler.fetchDepots(authToken);
    res.status(200).json({
      success: true,
      data: depots,
      count: depots.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


router.get("/vehicles", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split(" ")[1] || "";
    const vehicles = await scheduler.fetchVehicles(authToken);

    const depotId = req.query.depotId;
    const filteredVehicles = depotId
      ? vehicles.filter((v) => v.depotId === depotId)
      : vehicles;

    res.status(200).json({
      success: true,
      data: filteredVehicles,
      count: filteredVehicles.length,
      totalVehicles: vehicles.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


router.post("/schedule", async (req, res) => {
  try {
    const { availableHours, depotId } = req.body;
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split(" ")[1] || "";

    if (!availableHours || typeof availableHours !== "number" || availableHours <= 0) {
      return res.status(400).json({
        success: false,
        error: "availableHours must be a positive number",
      });
    }

    const schedule = await scheduler.getOptimalRepairSchedule(
      depotId,
      availableHours,
      authToken
    );

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


router.get("/schedule", async (req, res) => {
  try {
    const { availableHours, depotId } = req.query;
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split(" ")[1] || "";

    // Validate input
    const hours = parseFloat(availableHours);
    if (!hours || isNaN(hours) || hours <= 0) {
      return res.status(400).json({
        success: false,
        error: "availableHours must be a positive number",
      });
    }

    const schedule = await scheduler.getOptimalRepairSchedule(depotId, hours, authToken);

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
