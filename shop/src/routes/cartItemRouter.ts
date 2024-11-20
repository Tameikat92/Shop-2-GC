import express from 'express';
import CartItem from '../models/cartItem';

import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

dotenv.config();
const cartItemRouter = express.Router();
const client = new MongoClient(process.env.MONGODB_URI!);

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// GET /users/:userId/cart - Get all cart items for a user
cartItemRouter.get("/users/:userId/cart", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db().collection<CartItem>("cartItems");

    const cartItems = await collection.find({ userId: new ObjectId(req.params.userId) }).toArray();
    res.status(200).json(cartItems);
  } catch (error) {
    errorResponse(error, res);
  } finally {
    await client.close();
  }
});


// POST /users/:userId/cart - Add a new cart item
cartItemRouter.post("/users/:userId/cart", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db().collection<CartItem>("cartItems");

    // Prepare the new CartItem
    const newCartItem: CartItem = {
      userId: new ObjectId(req.params.userId),
      product: { ...req.body.product, _id: new ObjectId(req.body.product._id) },
      quantity: req.body.quantity,
    };

    // Insert the new cart item
    const result = await collection.insertOne(newCartItem);
    res.status(201).json({ _id: result.insertedId, ...newCartItem });
  } catch (error) {
    errorResponse(error, res);
  } finally {
    await client.close();
  }
});

// PATCH /users/:userId/cart/:productId - Partially update cart item fields
cartItemRouter.patch("/users/:userId/cart/:productId", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db().collection<CartItem>("cartItems");

    const updateFields = req.body;
    const result = await collection.updateOne(
      {
        userId: new ObjectId(req.params.userId),
        "product._id": new ObjectId(req.params.productId)
      },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).send("Cart item not found");
    } else {
      const updatedCartItem = await collection.findOne({
        userId: new ObjectId(req.params.userId),
        "product._id": new ObjectId(req.params.productId)
      });
      res.status(200).json(updatedCartItem);
    }
  } catch (error) {
    errorResponse(error, res);
  } finally {
    await client.close();
  }
});

// PATCH /users/:userId/cart/:productId/increment - Increment quantity by a specified number
cartItemRouter.patch("/users/:userId/cart/:productId/increment", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db().collection<CartItem>("cartItems");

    const increment = req.body.quantity || 0;
    const result = await collection.updateOne(
      {
        userId: new ObjectId(req.params.userId),
        "product._id": new ObjectId(req.params.productId)
      },
      { $inc: { quantity: increment } }
    );

    if (result.matchedCount === 0) {
      res.status(404).send("Cart item not found");
    } else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    errorResponse(error, res);
  } finally {
    await client.close();
  }
});



// DELETE /users/:userId/cart/:productId - Remove a cart item
cartItemRouter.delete("/users/:userId/cart/:productId", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db().collection<CartItem>("cartItems");

    const result = await collection.deleteOne({
      userId: new ObjectId(req.params.userId),
      "product._id": new ObjectId(req.params.productId)
    });

    if (result.deletedCount === 0) {
      res.status(404).send("Not found");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    errorResponse(error, res);
  } finally {
    await client.close();
  }
});

export default cartItemRouter;