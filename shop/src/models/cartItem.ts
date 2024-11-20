import { ObjectId } from 'mongodb';


interface Product {
    _id: ObjectId;
    name: string;
    price: number;
    photoURL?: string;
  }
  
  interface CartItem {
    _id?: ObjectId;
    userId: ObjectId;
    product: Product;
    quantity: number;
  }
  
 
export default CartItem;
