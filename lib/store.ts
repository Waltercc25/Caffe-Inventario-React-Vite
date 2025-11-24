import { Product } from './types';

// Mock initial data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ethiopian Yirgacheffe',
    type: 'Coffee Bean',
    price: 18.50,
    stock: 45,
    sku: 'COF-ETH-001',
    description: 'Floral and citrus notes, light roast.',
    supplier: 'Global Beans Co.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Croissant',
    type: 'Pastry',
    price: 3.50,
    stock: 20,
    sku: 'PAS-CRO-001',
    description: 'Butter croissant, fresh baked daily.',
    supplier: 'In-house',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'V60 Filters (100ct)',
    type: 'Equipment',
    price: 8.00,
    stock: 15,
    sku: 'EQP-V60-001',
    description: 'Paper filters for V60 dripper.',
    supplier: 'Hario',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Oat Milk (Barista Edition)',
    type: 'Ingredient',
    price: 4.50,
    stock: 120,
    sku: 'ING-OAT-001',
    description: 'Plant-based milk alternative.',
    supplier: 'Oatly',
    lastUpdated: new Date().toISOString(),
  },
];

// Simple in-memory store simulation
export class InventoryStore {
  private static instance: InventoryStore;
  private products: Product[] = [...INITIAL_PRODUCTS];

  private constructor() {}

  public static getInstance(): InventoryStore {
    if (!InventoryStore.instance) {
      InventoryStore.instance = new InventoryStore();
    }
    return InventoryStore.instance;
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Product {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length !== initialLength;
  }
}
