import { Link, useLocation, Outlet } from 'react-router-dom'
import { Coffee, LayoutDashboard, Package, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useNavigate } from 'react-router-dom'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigation = [
    { name: 'Resumen', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventario', href: '/dashboard/inventory', icon: Package },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-2 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <Coffee className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl text-sidebar-foreground">Café Manager</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-2 px-3 py-2 text-xs text-sidebar-foreground/60">
          {user?.email}
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

