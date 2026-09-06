import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { fetchFloodData } from "./lib/floodData";

// Start the data request immediately, before React mounts, so the dashboard
// has its numbers as early as possible.
fetchFloodData().catch(() => {});

createRoot(document.getElementById("root")!).render(<App />);
