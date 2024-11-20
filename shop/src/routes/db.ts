 



const uri = "mongodb+srv://meekestmeek:nQTas5EJoQkEJgbZ@cluster0.j6tsj.mongodb.net/"
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';


dotenv.config();

//const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop_db';
const dbName = 'shop_db';

export const connectToDatabase = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to database');
  return client.db(dbName);
};