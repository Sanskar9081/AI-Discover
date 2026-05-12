/**
 * Futurepedia Scraper Backend Server
 * Runs on port 3001 to avoid CORS issues
 * Fetches tools from Futurepedia.io server-side
 */

import http from 'http';
import https from 'https';
import url from 'url';

const PORT = 3001;

// Helper to make HTTPS requests
const fetchUrl = (urlString) => {
  return new Promise((resolve, reject) => {
    https.get(urlString, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers,
          });
        }
      });
    }).on('error', reject);
  });
};

// Fetch tools with pagination
const fetchAllTools = async () => {
  console.log('📡 Starting Futurepedia scrape server-side...');
  const allTools = [];
  
  // Try to fetch multiple pages
  const pageCount = 20; // Should get ~4000-5000 tools
  
  for (let page = 1; page <= pageCount; page++) {
    try {
      const endpoints = [
        `https://www.futurepedia.io/api/v1/tools?page=${page}&pageSize=200`,
        `https://www.futurepedia.io/api/tools?page=${page}&limit=200`,
      ];

      let success = false;
      for (const endpoint of endpoints) {
        try {
          console.log(`   Fetching page ${page}: ${endpoint}`);
          const response = await fetchUrl(endpoint);
          
          if (response.status === 200 && response.data) {
            const data = response.data;
            const pageTools = Array.isArray(data) 
              ? data 
              : data.tools || data.data || data.items || [];
            
            if (pageTools.length > 0) {
              allTools.push(...pageTools);
              console.log(`   ✓ Page ${page}: +${pageTools.length} tools (Total: ${allTools.length})`);
              success = true;
              break;
            }
          }
        } catch (e) {
          // Try next endpoint
        }
      }

      if (!success) {
        console.log(`   ✗ Page ${page}: No data found, stopping here`);
        break;
      }

      // Rate limiting - be nice to the API
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.log(`   ✗ Page ${page} error:`, error.message);
      break;
    }
  }

  return allTools;
};

// Create server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (parsedUrl.pathname === '/api/futurepedia-tools') {
    try {
      console.log(`\n🚀 API Request: GET /api/futurepedia-tools`);
      const tools = await fetchAllTools();
      
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        count: tools.length,
        tools: tools,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('❌ Error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({
        success: false,
        error: error.message,
      }));
    }
  } else if (parsedUrl.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Futurepedia Scraper Server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoint: http://localhost:${PORT}/api/futurepedia-tools`);
  console.log('\nWaiting for requests...\n');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Kill the process or use a different port.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});
