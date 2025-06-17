class ShelfHeatAnalytics {
  constructor() {
    this.data = {
      kpi: null,
      environmental: null,
      heatmap: null
    };
    
    this.init();
    this.startRealTimeUpdates();
  }

  init() {
    this.setupTabs();
    this.updateClock();
    this.loadInitialData();
    
    // Update clock every second
    setInterval(() => this.updateClock(), 1000);
  }

  setupTabs() {
    const tabs = document.querySelectorAll('.shelf-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        contents.forEach(content => {
          content.classList.remove('active');
          if (content.id === targetTab + 'Content') {
            content.classList.add('active');
          }
        });
      });
    });
  }

  updateClock() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    document.getElementById('lastUpdate').textContent = `Last update: ${timeString}`;
  }

  async loadInitialData() {
    try {
      await Promise.all([
        this.fetchKPIData(),
        this.fetchEnvironmentalData(),
        this.fetchHeatmapData()
      ]);
      
      this.renderDashboard();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  async fetchKPIData() {
    const response = await fetch('/api/kpi');
    this.data.kpi = await response.json();
  }

  async fetchEnvironmentalData() {
    const response = await fetch('/api/environmental');
    this.data.environmental = await response.json();
  }

  async fetchHeatmapData() {
    const response = await fetch('/api/heatmap');
    this.data.heatmap = await response.json();
  }

  renderDashboard() {
    this.renderKPICards();
    this.renderHeatmap();
  }

  renderKPICards() {
    const kpiGrid = document.getElementById('kpiGrid');
    const { kpi, environmental } = this.data;

    if (!kpi || !environmental) return;

    const kpiCards = [
      {
        title: 'Live Customers',
        value: kpi.liveCustomers,
        target: 80,
        unit: '👥',
        targetLabel: 'customers',
        description: 'Normal flow',
        status: 'normal'
      },
      {
        title: 'Queue Status',
        value: kpi.queueCount,
        target: 5,
        unit: '⏱️',
        targetLabel: 'people',
        status: 'normal'
      },
      {
        title: 'Conversion Rate',
        value: kpi.conversionRate,
        target: 75,
        unit: '%',
        targetLabel: '%',
        description: 'On target',
        status: 'normal',
        showPercentage: true
      },
      {
        title: 'Revenue Hour',
        value: kpi.revenueHour,
        target: 4500,
        unit: '💰',
        targetLabel: '$',
        status: 'normal',
        showCurrency: true
      },
      {
        title: 'Active Alerts',
        value: kpi.activeAlerts,
        target: 0,
        unit: '🚨',
        targetLabel: 'alerts',
        status: kpi.activeAlerts > 0 ? 'warning' : 'normal'
      },
      {
        title: 'Security Status',
        value: kpi.securityStatus,
        target: 0,
        unit: '🔒',
        targetLabel: 'incidents',
        status: 'normal'
      }
    ];

    // Environmental monitoring card
    const environmentalCard = {
      title: 'Environmental Monitoring',
      type: 'environmental',
      data: environmental
    };

    kpiGrid.innerHTML = '';

    // Render KPI cards
    kpiCards.forEach(card => {
      const cardElement = this.createKPICard(card);
      kpiGrid.appendChild(cardElement);
    });

    // Render environmental card
    const envCardElement = this.createEnvironmentalCard(environmentalCard);
    kpiGrid.appendChild(envCardElement);
  }

  createKPICard(card) {
    const div = document.createElement('div');
    div.className = 'shelf-kpi-card';

    const formatValue = (val) => {
      if (card.showPercentage) return val.toFixed(1);
      if (card.showCurrency) return val.toString();
      return val.toString();
    };

    const getStatusText = () => {
      if (card.status === 'warning') return 'Requires attention';
      if (card.status === 'critical') return 'Critical';
      return 'All systems normal';
    };

    div.innerHTML = `
      <div class="shelf-kpi-header">${card.title}</div>
      <div class="shelf-kpi-value">
        <span>
          ${card.showCurrency ? '$' : ''}${formatValue(card.value)}${card.showPercentage ? '%' : ''}
        </span>
        ${card.unit ? `<span style="font-size: 20px;">${card.unit}</span>` : ''}
      </div>
      <div class="shelf-kpi-target">
        Target: ${card.showCurrency ? '$' : ''}${card.target} ${card.targetLabel}
        ${card.description ? `<br><span style="color: var(--shelf-success);">📈 ${card.description}</span>` : ''}
      </div>
      <span class="shelf-kpi-status ${card.status === 'warning' ? 'warning' : ''}">
        ${getStatusText()}
      </span>
    `;

    return div;
  }

  createEnvironmentalCard(card) {
    const div = document.createElement('div');
    div.className = 'shelf-environmental-section';

    const environmentalItems = [
      {
        label: 'Store Temperature',
        value: `${card.data.temperature.toFixed(1)}°C ●`
      },
      {
        label: 'Humidity',
        value: `${card.data.humidity}% ●`
      },
      {
        label: 'Air Quality',
        value: `${card.data.airQuality} ●`
      },
      {
        label: 'Noise Level',
        value: `${card.data.noiseLevel} dB ●`
      },
      {
        label: 'Lighting',
        value: `${card.data.lighting} ●`
      }
    ];

    div.innerHTML = `
      <div class="shelf-env-header">
        <span style="font-size: 20px;">🌡️</span>
        <h3>Environmental Monitoring</h3>
      </div>
      <div class="shelf-env-items">
        ${environmentalItems.map(item => `
          <div class="shelf-env-item">
            <div class="shelf-env-label">${item.label}</div>
            <div class="shelf-env-value">${item.value}</div>
          </div>
        `).join('')}
      </div>
    `;

    return div;
  }

  renderHeatmap() {
    const heatmapGrid = document.getElementById('heatmapGrid');
    const { heatmap } = this.data;

    if (!heatmap) return;

    heatmapGrid.innerHTML = '';

    // Sort by cellId to ensure consistent grid layout
    const sortedHeatmap = heatmap.sort((a, b) => a.cellId.localeCompare(b.cellId));

    sortedHeatmap.forEach(cell => {
      const cellElement = this.createHeatmapCell(cell);
      heatmapGrid.appendChild(cellElement);
    });
  }

  createHeatmapCell(cell) {
    const div = document.createElement('div');
    div.className = `shelf-heatmap-cell ${this.getActivityClass(cell.activity)}`;
    div.textContent = cell.activity;

    // Add hover tooltip
    div.addEventListener('mouseenter', (e) => {
      this.showTooltip(e, `Cell ${cell.cellId}\nActivity: ${cell.activity}%\nSection: ${cell.section}`);
    });

    div.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });

    return div;
  }

  getActivityClass(activity) {
    if (activity >= 80) return 'critical';
    if (activity >= 60) return 'high';
    if (activity >= 20) return 'medium';
    if (activity >= 10) return 'low';
    return 'minimal';
  }

  showTooltip(event, content) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = content;
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY - 10 + 'px';
    tooltip.style.opacity = '1';
  }

  hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.opacity = '0';
  }

  async simulateDataUpdate() {
    try {
      await fetch('/api/simulate-update', { method: 'POST' });
    } catch (error) {
      console.error('Failed to simulate data update:', error);
    }
  }

  startRealTimeUpdates() {
    // Update data every 3 seconds
    setInterval(async () => {
      try {
        await this.simulateDataUpdate();
        await Promise.all([
          this.fetchKPIData(),
          this.fetchEnvironmentalData(),
          this.fetchHeatmapData()
        ]);
        this.renderDashboard();
      } catch (error) {
        console.error('Failed to update data:', error);
      }
    }, 3000);
  }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ShelfHeatAnalytics();
});