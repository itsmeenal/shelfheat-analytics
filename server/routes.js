const storage = require('./storage');

function registerRoutes(app) {
  // === Existing Routes ===
  app.get("/api/kpi", (req, res) => {
    try {
      const kpi = storage.getLatestKPI();
      res.json(kpi);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KPI data" });
    }
  });

  app.get("/api/environmental", (req, res) => {
    try {
      const environmental = storage.getLatestEnvironmental();
      res.json(environmental);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environmental data" });
    }
  });

  app.get("/api/heatmap", (req, res) => {
    try {
      const heatmap = storage.getLatestHeatmap();
      res.json(heatmap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  });

  app.post("/api/simulate-update", (req, res) => {
    try {
      const currentKPI = storage.getLatestKPI();
      const currentEnvironmental = storage.getLatestEnvironmental();
      const currentHeatmap = storage.getLatestHeatmap();

      if (currentKPI && currentEnvironmental && currentHeatmap) {
        const newKPI = {
          liveCustomers: Math.max(45, Math.min(85, currentKPI.liveCustomers + (Math.floor(Math.random() * 6) - 3))),
          queueCount: Math.floor(Math.random() * 8),
          conversionRate: Math.max(75, Math.min(95, currentKPI.conversionRate + (Math.random() - 0.5) * 2)),
          revenueHour: Math.max(3000, Math.min(5000, currentKPI.revenueHour + (Math.floor(Math.random() * 200) - 100))),
          activeAlerts: Math.floor(Math.random() * 3),
          securityStatus: Math.floor(Math.random() * 2),
        };

        const newEnvironmental = {
          temperature: Math.max(20, Math.min(24, currentEnvironmental.temperature + (Math.random() - 0.5) * 0.2)),
          humidity: Math.max(45, Math.min(65, currentEnvironmental.humidity + (Math.floor(Math.random() * 6) - 3))),
          airQuality: Math.random() > 0.9 ? "poor" : "good",
          noiseLevel: Math.max(40, Math.min(60, currentEnvironmental.noiseLevel + (Math.floor(Math.random() * 6) - 3))),
          lighting: Math.random() > 0.95 ? "suboptimal" : "optimal",
        };

        const newHeatmapData = currentHeatmap.map(cell => ({
          cellId: cell.cellId,
          activity: Math.max(0, Math.min(100, cell.activity + (Math.random() > 0.9 ? (Math.floor(Math.random() * 10) - 5) : 0))),
          section: cell.section,
        }));

        storage.updateKPI(newKPI);
        storage.updateEnvironmental(newEnvironmental);
        storage.updateHeatmapData(newHeatmapData);

        res.json({ success: true });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to simulate data update" });
    }
  });

  // === 🔥 NEW ROUTES for Buttons ===

  // Alerts
  app.get("/api/staff-alerts", (req, res) => {
    res.json([
      { id: 1, type: "Overcrowding", message: "Too many customers in Aisle 3", time: "09:15 AM" },
      { id: 2, type: "Queue Length", message: "Checkout counter queue exceeds limit", time: "10:40 AM" }
    ]);
  });

  // Staff AI
  app.get("/api/ai-predictions", (req, res) => {
    res.json({
      recommendations: [
        { action: "Deploy more staff to Zone B", confidence: "High" },
        { action: "Schedule a break for Cashier 2", confidence: "Medium" }
      ]
    });
  });

  // Revenue AI
  app.get("/api/revenue-report", (req, res) => {
    res.json({
      revenueToday: 4850,
      peakHours: ["1PM - 3PM", "5PM - 7PM"],
      productTrends: [
        { name: "Milk", growth: "18%" },
        { name: "Snacks", growth: "24%" },
        { name: "Soft Drinks", growth: "15%" }
      ]
    });
  });

  // Business Intelligence
  app.get("/api/business-intelligence", (req, res) => {
    res.json({
      dashboards: [
        {
          id: "bi001",
          title: "Foot Traffic Trends",
          widgets: ["Line Chart", "Geo Heatmap"],
          lastUpdated: "Today, 12:10 PM"
        },
        {
          id: "bi002",
          title: "Revenue Breakdown",
          widgets: ["Pie Chart", "Daily Totals"],
          lastUpdated: "Today, 11:30 AM"
        }
      ]
    });
  });
}

module.exports = { registerRoutes };
