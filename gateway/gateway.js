const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { rateLimit } = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1); // diperlukan saat di-deploy di balik proxy (mis. Render)

// 1) rate limit: maks. 20 request per 10 detik per alamat IP
app.use(rateLimit({
  windowMs: 10 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
}));

// 2) cek API key (tantangan opsional) - khusus /service-b
const requireApiKey = (req, res, next) => {
  if (!process.env.API_KEY || req.get('X-API-Key') !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
app.use('/service-b', requireApiKey);

// 3) routing
app.use(createProxyMiddleware({
  pathFilter: '/service-a',
  target: process.env.SERVICE_A_URL || 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: { '^/service-a': '' },
}));

app.use(createProxyMiddleware({
  pathFilter: '/service-b',
  target: process.env.SERVICE_B_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/service-b': '' },
}));

app.use((req, res) => res.status(404).json({ error: 'Route tidak ditemukan' }));

app.listen(process.env.PORT || 8080, () => console.log('Gateway berjalan di port 8080'));
