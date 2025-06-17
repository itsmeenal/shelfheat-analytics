class MemStorage {
  constructor() {
    this.kpiData = [];
    this.environmentalData = [];
    this.heatmapData = [];
    this.currentId = 1;
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Initialize KPI data
    this.kpiData.push({
      id: this.currentId++,
      liveCustomers: 62,
      queueCount: 3,
      conversionRate: 81.4,
      revenueHour: 3483,
      activeAlerts: 1,
      securityStatus: 0,
      timestamp: new Date(),
    });

    // Initialize environmental data
    this.environmentalData.push({
      id: this.currentId++,
      temperature: 21.5,
      humidity: 53,
      airQuality: "good",
      noiseLevel: 46,
      lighting: "optimal",
      timestamp: new Date(),
    });

    // Initialize heatmap data (8x3 grid)
    const defaultCells = [
      { cellId: 'A1', activity: 85, section: 'entrance' },
      { cellId: 'A2', activity: 92, section: 'entrance' },
      { cellId: 'A3', activity: 78, section: 'electronics' },
      { cellId: 'A4', activity: 65, section: 'electronics' },
      { cellId: 'A5', activity: 43, section: 'clothing' },
      { cellId: 'A6', activity: 67, section: 'clothing' },
      { cellId: 'A7', activity: 89, section: 'home' },
      { cellId: 'A8', activity: 74, section: 'home' },
      { cellId: 'B1', activity: 95, section: 'entrance' },
      { cellId: 'B2', activity: 12, section: 'books' },
      { cellId: 'B3', activity: 23, section: 'books' },
      { cellId: 'B4', activity: 87, section: 'toys' },
      { cellId: 'B5', activity: 15, section: 'sports' },
      { cellId: 'B6', activity: 8, section: 'sports' },
      { cellId: 'B7', activity: 6, section: 'grocery' },
      { cellId: 'B8', activity: 9, section: 'grocery' },
      { cellId: 'C1', activity: 0, section: 'entrance' },
      { cellId: 'C2', activity: 0, section: 'books' },
      { cellId: 'C3', activity: 0, section: 'books' },
      { cellId: 'C4', activity: 0, section: 'toys' },
      { cellId: 'C5', activity: 0, section: 'sports' },
      { cellId: 'C6', activity: 0, section: 'sports' },
      { cellId: 'C7', activity: 0, section: 'grocery' },
      { cellId: 'C8', activity: 0, section: 'grocery' }
    ];

    defaultCells.forEach(cell => {
      this.heatmapData.push({
        id: this.currentId++,
        cellId: cell.cellId,
        activity: cell.activity,
        section: cell.section,
        timestamp: new Date(),
      });
    });
  }

  getLatestKPI() {
    return this.kpiData[this.kpiData.length - 1];
  }

  getLatestEnvironmental() {
    return this.environmentalData[this.environmentalData.length - 1];
  }

  getLatestHeatmap() {
    const latestCells = new Map();
    this.heatmapData.forEach(cell => {
      if (!latestCells.has(cell.cellId) || 
          cell.timestamp > latestCells.get(cell.cellId).timestamp) {
        latestCells.set(cell.cellId, cell);
      }
    });
    return Array.from(latestCells.values());
  }

  updateKPI(data) {
    const kpi = {
      id: this.currentId++,
      ...data,
      timestamp: new Date(),
    };
    this.kpiData.push(kpi);
    return kpi;
  }

  updateEnvironmental(data) {
    const environmental = {
      id: this.currentId++,
      ...data,
      timestamp: new Date(),
    };
    this.environmentalData.push(environmental);
    return environmental;
  }

  updateHeatmapData(data) {
    const results = [];
    data.forEach(item => {
      const heatmapItem = {
        id: this.currentId++,
        ...item,
        timestamp: new Date(),
      };
      this.heatmapData.push(heatmapItem);
      results.push(heatmapItem);
    });
    return results;
  }
}

module.exports = new MemStorage();