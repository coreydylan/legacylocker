import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from './AdminLayout';

const AdminAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication status in AdminAuth...');
      const { data: { session }, error: authError } = await supabase.auth.getSession();

      if (authError) {
        console.error('Auth error:', authError);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      console.log('Auth session in AdminAuth:', session);

      // For development/localhost, bypass authentication
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development environment detected, bypassing authentication');
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (session) {
        console.log('Valid session found');
        setIsAuthenticated(true);
      } else {
        console.log('No valid session found');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting login...');
      const adminPassword = process.env.VITE_ADMIN_PASSWORD || 'legacylocker2024';
      
      if (password === adminPassword) {
        // Sign in with Supabase using email/password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@legacylockerco.com',
          password: adminPassword,
        });
        
        if (error) {
          console.error('Supabase auth error:', error);
          toast({
            title: 'Authentication Error',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        console.log('Login successful:', data);
        setIsAuthenticated(true);
        toast({
          title: 'Success',
          description: 'You have been authenticated as an admin',
        });
      } else {
        console.log('Invalid password attempt');
        toast({
          title: 'Error',
          description: 'Invalid password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminAuth; 