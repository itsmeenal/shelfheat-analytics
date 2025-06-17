const express = require('express');
const cors = require('cors');
const path = require('path');
const { registerRoutes } = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory with proper MIME types
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Register API routes
registerRoutes(app);

// Serve the frontend for all non-API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 ShelfHeat Analytics - Server Started!');
  console.log('='.repeat(50));
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔥 Real-time updates every 3 seconds`);
  console.log(`📱 Responsive design for all devices`);
  console.log('='.repeat(50));
  console.log('Features:');
  console.log('✅ Live KPI monitoring');
  console.log('✅ Interactive store heatmap');
  console.log('✅ Environmental tracking');
  console.log('✅ Real-time data simulation');
  console.log('='.repeat(50));
});