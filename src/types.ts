export interface Product {
  id: number;
  name: string;
  englishName: string;
  category: string;
  categoryFa: string;
  price: number; // in AFN (Afghanis)
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ReviewFa {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
