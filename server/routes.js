const storage = require('./storage');

function registerRoutes(app) {
  // Get latest KPI data
  app.get("/api/kpi", (req, res) => {
    try {
      const kpi = storage.getLatestKPI();
      res.json(kpi);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KPI data" });
    }
  });

  // Get latest environmental data
  app.get("/api/environmental", (req, res) => {
    try {
      const environmental = storage.getLatestEnvironmental();
      res.json(environmental);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environmental data" });
    }
  });

  // Get latest heatmap data
  app.get("/api/heatmap", (req, res) => {
    try {
      const heatmap = storage.getLatestHeatmap();
      res.json(heatmap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  });

  // Simulate real-time data updates
  app.post("/api/simulate-update", (req, res) => {
    try {
      const currentKPI = storage.getLatestKPI();
      const currentEnvironmental = storage.getLatestEnvironmental();
      const currentHeatmap = storage.getLatestHeatmap();

      if (currentKPI && currentEnvironmental && currentHeatmap) {
        // Simulate KPI changes
        const newKPI = {
          liveCustomers: Math.max(45, Math.min(85, currentKPI.liveCustomers + (Math.floor(Math.random() * 6) - 3))),
          queueCount: Math.floor(Math.random() * 8),
          conversionRate: Math.max(75, Math.min(95, currentKPI.conversionRate + (Math.random() - 0.5) * 2)),
          revenueHour: Math.max(3000, Math.min(5000, currentKPI.revenueHour + (Math.floor(Math.random() * 200) - 100))),
          activeAlerts: Math.floor(Math.random() * 3),
          securityStatus: Math.floor(Math.random() * 2),
        };

        // Simulate environmental changes
        const newEnvironmental = {
          temperature: Math.max(20, Math.min(24, currentEnvironmental.temperature + (Math.random() - 0.5) * 0.2)),
          humidity: Math.max(45, Math.min(65, currentEnvironmental.humidity + (Math.floor(Math.random() * 6) - 3))),
          airQuality: Math.random() > 0.9 ? "poor" : "good",
          noiseLevel: Math.max(40, Math.min(60, currentEnvironmental.noiseLevel + (Math.floor(Math.random() * 6) - 3))),
          lighting: Math.random() > 0.95 ? "suboptimal" : "optimal",
        };

        // Simulate heatmap changes
        const newHeatmapData = currentHeatmap.map(cell => ({
          cellId: cell.cellId,
          activity: Math.max(0, Math.min(100, cell.activity + (Math.random() > 0.9 ? (Math.floor(Math.random() * 10) - 5) : 0))),
          section: cell.section,
        }));

        // Save new data
        storage.updateKPI(newKPI);
        storage.updateEnvironmental(newEnvironmental);
        storage.updateHeatmapData(newHeatmapData);

        res.json({ success: true });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to simulate data update" });
    }
  });
}

module.exports = { registerRoutes };