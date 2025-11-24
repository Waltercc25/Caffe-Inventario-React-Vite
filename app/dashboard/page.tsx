import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { InventoryStore } from '@/lib/store';

export default function DashboardPage() {
  const store = InventoryStore.getInstance();
  const products = store.getProducts();
  
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 20).length;
  const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-2">Bienvenido al sistema de gestión de inventario.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Costo total estimado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajo Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStock}</div>
            <p className="text-xs text-muted-foreground">Requieren reordenar</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">Desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.type}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-secondary/20 border-secondary/50">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Utiliza el módulo de inventario para gestionar tus productos y generar códigos QR.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 bg-background rounded-lg border text-center">
                <span className="block text-2xl mb-1">📦</span>
                <span className="text-xs font-medium">Agregar Stock</span>
              </div>
              <div className="p-4 bg-background rounded-lg border text-center">
                <span className="block text-2xl mb-1">🏷️</span>
                <span className="text-xs font-medium">Imprimir QR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
