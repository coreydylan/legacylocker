import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Settings, 
  Users, 
  BarChart, 
  FileText, 
  Image 
} from 'lucide-react';

// Helper to toggle ?editMode param and reload
const toggleEditMode = () => {
  const url = new URL(window.location.href);
  const isEditing = url.searchParams.get('editMode') === 'true';
  if (isEditing) {
    url.searchParams.delete('editMode');
  } else {
    url.searchParams.set('editMode', 'true');
  }
  window.history.replaceState({}, '', url.toString());
  window.location.reload();
};

const AdminDashboard = () => {
  const isEditing = new URLSearchParams(window.location.search).get('editMode') === 'true';

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Story Series
            </CardTitle>
            <CardDescription>
              Manage story series and their samples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Create, edit, and manage story series and their associated samples.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/series">
                Manage Series
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Story Samples
            </CardTitle>
            <CardDescription>
              Manage individual story samples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Create and manage individual story samples across all series.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/samples">
                Manage Samples
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Media Library
            </CardTitle>
            <CardDescription>
              Manage images and media assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Upload and manage images for story samples.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/media">
                Media Library
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Users
            </CardTitle>
            <CardDescription>
              Manage user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              View and manage user accounts and permissions.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/users">
                Manage Users
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Analytics
            </CardTitle>
            <CardDescription>
              View usage statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              View analytics and usage statistics for stories and series.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/analytics">
                View Analytics
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure admin settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Configure admin panel settings and preferences.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/settings">
                Settings
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Promo Codes
            </CardTitle>
            <CardDescription>
              Create and manage discount codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Add, edit, enable or disable promotional codes.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/promo-codes">Manage Promo Codes</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View, manage, and track the status of customer orders.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/orders">
                Manage Orders
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 