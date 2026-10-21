const express = require('express');
const app = express();
app.use(express.json());

const orders = [{ id: 1, productId: 1, qty: 2 }];

app.get('/', (req, res) => res.json({ service: 'service-b (pesanan)', ok: true }));
app.get('/orders', (req, res) => res.json(orders));
app.post('/orders', (req, res) => {
  const o = { id: orders.length + 1, ...req.body };
  orders.push(o);
  res.status(201).json(o);
});

app.listen(process.env.PORT || 3001, () => console.log('service-b di port 3001'));
