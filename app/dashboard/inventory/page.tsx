'use client';

import { useState } from 'react';
import { Plus, Search, QrCode, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ProductForm } from '@/components/product-form';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { InventoryStore } from '@/lib/store';
import { Product } from '@/lib/types';

export default function InventoryPage() {
  const store = InventoryStore.getInstance();
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingQR, setViewingQR] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (data: Omit<Product, 'id' | 'lastUpdated'>) => {
    store.addProduct(data);
    setProducts([...store.getProducts()]);
    setIsAddOpen(false);
  };

  const handleEditProduct = (data: Omit<Product, 'id' | 'lastUpdated'>) => {
    if (editingProduct) {
      store.updateProduct(editingProduct.id, data);
      setProducts([...store.getProducts()]);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      store.deleteProduct(id);
      setProducts([...store.getProducts()]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestiona tus productos y códigos QR.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Buscar por nombre, SKU o tipo..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>{product.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {product.type}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-destructive font-bold" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setViewingQR(product)}>
                          <QrCode className="mr-2 h-4 w-4" /> Ver QR
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleAddProduct} 
            onCancel={() => setIsAddOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <ProductForm 
            initialData={editingProduct || undefined}
            onSubmit={handleEditProduct} 
            onCancel={() => setEditingProduct(null)} 
          />
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!viewingQR} onOpenChange={(open) => !open && setViewingQR(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">Código QR del Producto</DialogTitle>
          </DialogHeader>
          {viewingQR && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <QRCodeDisplay 
                value={JSON.stringify({ id: viewingQR.id, sku: viewingQR.sku })} 
                label={viewingQR.name}
              />
              <div className="text-center space-y-1">
                <p className="font-medium">{viewingQR.name}</p>
                <p className="text-sm text-muted-foreground font-mono">{viewingQR.sku}</p>
              </div>
              <Button className="w-full" onClick={() => window.print()}>
                Imprimir Etiqueta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
