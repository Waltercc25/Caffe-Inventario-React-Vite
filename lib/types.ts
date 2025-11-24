export type ProductType = 'Coffee Bean' | 'Pastry' | 'Equipment' | 'Merchandise' | 'Ingredient';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  stock: number;
  sku: string;
  description?: string;
  supplier?: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}
