
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  PanelLeft,
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  MessageSquare, 
  Bell, 
  BarChart3,
  Search,
  User
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from '@/components/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      link: "/admin",
      active: location.pathname === "/admin",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      link: "/admin/orders",
      active: location.pathname === "/admin/orders",
    },
    {
      label: "Products",
      icon: Package,
      link: "/admin/products",
      active: location.pathname === "/admin/products",
    },
    {
      label: "Customers",
      icon: Users,
      link: "/admin/customers",
      active: location.pathname === "/admin/customers",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      link: "/admin/analytics",
      active: location.pathname === "/admin/analytics",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      link: "/admin/messages",
      active: location.pathname === "/admin/messages",
    },
    {
      label: "Settings",
      icon: Settings,
      link: "/admin/settings",
      active: location.pathname === "/admin/settings",
    },
  ];

  return (
    <SidebarProvider defaultOpen={open}>
      <div className="flex w-full min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center justify-center py-6">
            <Logo size="medium" />
            <h1 className="font-bold mt-2 text-lg">BeShop Admin</h1>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={item.active}
                        tooltip={item.label}
                      >
                        <Link to={item.link}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <Button 
              variant="destructive" 
              className="w-full mb-2"
              asChild
            >
              <Link to="/"> 
                <LogOut className="mr-2 h-4 w-4" />
                Exit Admin
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="p-4">
            <header className="flex items-center justify-between mb-8">
              <SidebarTrigger />
              
              <div className="ml-auto flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-64 pl-8"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">New order received</p>
                          <p className="text-xs text-muted-foreground">Order #12345 requires approval</p>
                          <p className="text-xs text-muted-foreground">30 minutes ago</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">Low stock alert</p>
                          <p className="text-xs text-muted-foreground">Product "Smartphone XYZ" is low on stock</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">New customer registered</p>
                          <p className="text-xs text-muted-foreground">Jean Mukendi has created an account</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer flex justify-center">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <ThemeToggle />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Exit Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            
            <div className="px-1">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
