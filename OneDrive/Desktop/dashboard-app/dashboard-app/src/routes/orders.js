const router = require('express').Router();
const { z } = require('zod');
const validate = require('../middleware/validate');
const orders = require('../services/orders');

const orderSchema = z.object({
  customer: z.string().trim().min(1).max(100),
  product: z.string().trim().min(1).max(100),
  amount: z.coerce.number().min(0).max(10000000)
});

router.get('/', async (req, res) => {
  res.json(await orders.list(req.user.id));
});

router.get('/stats', async (req, res) => {
  res.json(await orders.stats(req.user.id));
});

router.post('/', validate(orderSchema), async (req, res) => {
  res.status(201).json(await orders.create(req.user.id, req.body));
});

router.delete('/:id', async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  await orders.remove(req.user.id, req.params.id);
  res.status(204).end();
});

module.exports = router;
