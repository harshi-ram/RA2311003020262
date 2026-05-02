# RA2311003020262

# Vehicle Maintenance Scheduler - Backend

This backend is an Express app built to support vehicle repair scheduling using a logging middleware and a scheduler which gives the highest importance score.

## What is built so far

- `logging_middleware/middleware.js`
  - Custom request/response logging middleware
  - Logs method, path, response status, and duration
  - Uses our own logging function instead of direct `console.log` calls

- `vehicle_maintenance_scheduler/scheduler.js`
  - Core scheduling logic using a 0/1 knapsack algorithm
  - Computes the best subset of vehicles by `Duration` and `Impact`
  - Returns selected tasks with totals and remaining capacity

- `index.js`
  - Registers JSON body parsing and logging middleware

## Current behavior

- Local server runs at `http://localhost:3000`
- The app is designed to call protected external APIs with a Bearer token
- The current scheduler logic is built to handle API data with these fields:
  - `TaskID`
  - `Duration`
  - `Impact`

## Challenge encountered

- The external API is protected and requires a valid Bearer token.
- The bearer access token I received after registration was used to GET from http://20.207.122.201/evaluation-service/depots and http://20.207.122.201/evaluation-service/vehicles, but the API returned the token as invalid.
- The middleware and scheduler are implemented, but the external auth setup still needs a matching valid token for that endpoint.

## What is working now

- Logging middleware is active for all requests
- Scheduler route handling is wired through `index.js`
- The knapsack algorithm is ready to calculate the best repair subset for given hours


## Local Testing

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Check health:
   ```bash
   http://localhost:3000/health
   ```


## Notes

- The code is currently set up to use the logging middleware globally.
- The remaining blocker is obtaining a valid Bearer token for `http://20.207.122.201/evaluation-service`.
- Once the correct token is available, the scheduler should fetch the data and take details.

