export interface Farmer {
  id: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  imageUrl: string;
  joinedDate: string;
}

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  description: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Honey' | 'Herbs' | 'Grains';
  price: number;
  unit: string;
  stock: number;
  isOrganic: boolean;
  harvestDate: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Confirmed' | 'Packed' | 'On the way' | 'Delivered';
  deliveryAddress: string;
  paymentMethod?: 'Mobile Money' | 'Cash on Delivery';
}

export interface User {
  name: string;
  address: string;
}