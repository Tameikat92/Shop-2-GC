import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

// GET /users/:id - Retrieve a user by ID
router.get('/:id', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('users');
  const { id } = req.params;

  const user = await collection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    res.status(404).send('User not found');
    return;
  }

  res.status(200).json(user);
});

// POST /users - Add a new user
router.post('/', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('users');

  const newUser = req.body;
  const result = await collection.insertOne(newUser);

  res.status(201).json(result.ops[0]);
});

// PUT /users/:id - Update a user by ID
router.put('/:id', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('users');
  const { id } = req.params;
  const updatedUser = req.body;

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedUser },
    { returnDocument: 'after' }
  );

  if (!result.value) {
    res.status(404).send('User not found');
    return;
  }

  res.status(200).json(result.value);
});

// DELETE /users/:id - Remove a user by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const db = req.app.locals.db;
  const collection = db.collection('users');
  const { id } = req.params;

  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    res.status(404).send('User not found');
    return;
  }

  res.status(204).send();
});

export default router;