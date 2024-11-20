import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

// GET /products - Retrieve all products with optional query parameters
router.get('/', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('products');

  const { maxPrice, includes, limit } = req.query;

  let query: any = {};
  if (maxPrice) {
    query.price = { $lte: parseFloat(maxPrice as string) };
  }
  if (includes) {
    query.name = { $regex: includes as string, $options: 'i' };
  }

  let cursor = collection.find(query);

  if (limit) {
    cursor = cursor.limit(parseInt(limit as string, 10));
  }

  const products = await cursor.toArray();
  res.status(200).json(products);
});

// GET /products/:id - Retrieve a product by ID
router.get('/:id', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('products');
  const { id } = req.params;

  const product = await collection.findOne({ _id: new ObjectId(id) });

  if (!product) {
    res.status(404).send('Product not found');
    return;
  }

  res.status(200).json(product);
});

// POST /products - Add a new product
router.post('/', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('products');

  const newProduct = req.body;
  const result = await collection.insertOne(newProduct);

  res.status(201).json(result.ops[0]);
});

// PUT /products/:id - Update a product by ID
router.put('/:id', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('products');
  const { id } = req.params;
  const updatedProduct = req.body;

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedProduct },
    { returnDocument: 'after' }
  );

  if (!result.value) {
    res.status(404).send('Product not found');
    return;
  }

  res.status(200).json(result.value);
});

// DELETE /products/:id - Remove a product by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('products');
  const { id } = req.params;

  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    res.status(404).send('Product not found');
    return;
  }

  res.status(204).send();
});

export default router;