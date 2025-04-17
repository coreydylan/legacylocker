import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  Image, 
  Users, 
  BarChart, 
  Settings, 
  Home,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => Promise<void>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/admin/series', label: 'Story Series', icon: <BookOpen className="h-4 w-4" /> },
    { path: '/admin/samples', label: 'Story Samples', icon: <FileText className="h-4 w-4" /> },
    { path: '/admin/media', label: 'Media Library', icon: <Image className="h-4 w-4" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart className="h-4 w-4" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Legacy Locker Admin</h1>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  asChild
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? 'bg-gray-100' : ''}`}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Legacy Locker Admin</h1>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 