// ping.ts
import fetch from "node-fetch";

const PORT = process.env.PORT || 4000;
const BACKEND_URL = `http://localhost:${PORT}`;

async function ping() {
  try {
    const res = await fetch(BACKEND_URL);
    if (res.ok) {
      console.log("Ping successful:", new Date().toISOString());
    } else {
      console.error("Ping failed:", res.status, res.statusText);
    }
  } catch (err) {
    console.error("Ping error:", err);
  }
}

// Run immediately
ping();

// Then every 10 minutes
setInterval(ping, 10 * 60 * 1000); // 10 min in ms
