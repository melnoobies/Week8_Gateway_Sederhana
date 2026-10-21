const express = require('express');
const app = express();
app.use(express.json()); // parsing body dilakukan di service, bukan di gateway

const products = [
  { id: 1, name: 'Keyboard', price: 250000 },
  { id: 2, name: 'Mouse', price: 120000 },
];

app.get('/', (req, res) => res.json({ service: 'service-a (produk)', ok: true }));
app.get('/products', (req, res) => res.json(products));
app.post('/products', (req, res) => {
  const p = { id: products.length + 1, ...req.body };
  products.push(p);
  res.status(201).json(p);
});

app.listen(process.env.PORT || 3000, () => console.log('service-a di port 3000'));
