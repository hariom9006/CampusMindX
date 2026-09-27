/**
 * CampusMind X Test Setup Helper
 * Ensures the Express API Gateway and Database connection are ready before test suites execute.
 */

let serverReady = false;

export async function ensureServer() {
  if (serverReady) return;

  // Check if server is already running
  try {
    const res = await fetch('http://localhost:5000/api/health');
    if (res.ok) {
      serverReady = true;
      return;
    }
  } catch {
    // Server is not running yet
  }

  // Dynamically import index.js which boots express and connects to MongoDB
  await import('../src/index.js');

  // Poll until server responds to health check
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) {
        serverReady = true;
        return;
      }
    } catch {
      // Wait 150ms before next poll
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  throw new Error('Timed out waiting for CampusMind X server to start on port 5000');
}
