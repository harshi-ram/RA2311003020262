const API_BASE_URL = "http://20.207.122.201/evaluation-service";
const DEFAULT_AUTH_TOKEN = process.env.BEARER_TOKEN || "";

// Helper to create axios config with Bearer token
const getAuthHeaders = (token = "") => {
  const bearer = token || DEFAULT_AUTH_TOKEN;
  console.log("Auth token being used:", bearer ? "Present" : "Missing");
  const headers = {};
  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`;
    console.log("Authorization header set");
  } else {
    console.log("No authorization header set");
  }
  return { headers };
};

async function fetchDepots(authToken = "") {
  // Mock data for testing
  console.log("Using mock depot data");
  return [
    { id: "depot-1", name: "Main Depot", location: "Downtown" },
    { id: "depot-2", name: "North Depot", location: "North Side" },
    { id: "depot-3", name: "South Depot", location: "South Side" }
  ];
}


async function fetchVehicles(authToken = "") {
  // Mock data for testing - vehicles with TaskID, Duration, Impact
  console.log("Using mock vehicle data");
  return [
    { TaskID: "V001", Duration: 8, Impact: 95, depotId: "depot-1" },
    { TaskID: "V002", Duration: 6, Impact: 85, depotId: "depot-1" },
    { TaskID: "V003", Duration: 12, Impact: 90, depotId: "depot-2" },
    { TaskID: "V004", Duration: 4, Impact: 70, depotId: "depot-2" },
    { TaskID: "V005", Duration: 10, Impact: 88, depotId: "depot-3" },
    { TaskID: "V006", Duration: 5, Impact: 75, depotId: "depot-3" },
    { TaskID: "V007", Duration: 15, Impact: 92, depotId: "depot-1" },
    { TaskID: "V008", Duration: 7, Impact: 80, depotId: "depot-2" }
  ];
}

//dp
function findOptimalRepairSchedule(vehicles, availableHours) {
  const n = vehicles.length;
  const capacity = availableHours;

  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const vehicle = vehicles[i - 1];
    const duration = vehicle.Duration;
    const impact = vehicle.Impact;

    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];

      if (duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - duration] + impact);
      }
    }
  }

  const selectedVehicles = [];
  let remainingCapacity = capacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][remainingCapacity] !== dp[i - 1][remainingCapacity]) {
      const vehicle = vehicles[i - 1];
      selectedVehicles.push(vehicle);
      remainingCapacity -= vehicle.Duration;
    }
  }

  const totalDuration = selectedVehicles.reduce((sum, v) => sum + v.Duration, 0);
  const totalImpact = selectedVehicles.reduce((sum, v) => sum + v.Impact, 0);

  return {
    selectedVehicles: selectedVehicles.reverse(),
    totalDuration,
    totalImpact,
    remainingCapacity: capacity - totalDuration,
    maxPossibleImpact: dp[n][capacity],
  };
}


async function getOptimalRepairSchedule(depotId, availableHours, authToken = "") {
  try {
    let vehicles = await fetchVehicles(authToken);

    if (depotId) {
      vehicles = vehicles.filter((v) => v.depotId === depotId);
    }

    const validVehicles = vehicles.filter(
      (v) => v.Duration && v.Impact !== undefined
    );

    if (validVehicles.length === 0) {
      return {
        success: false,
        message: "No valid vehicles found",
        selectedVehicles: [],
        totalDuration: 0,
        totalImpact: 0,
      };
    }

    // Solve the optimization problem
    const result = findOptimalRepairSchedule(validVehicles, availableHours);

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Error in getOptimalRepairSchedule:", error.message);
    throw error;
  }
}

module.exports = {
  fetchDepots,
  fetchVehicles,
  findOptimalRepairSchedule,
  getOptimalRepairSchedule,
};
