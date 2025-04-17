import React from 'react';
import { Link } from 'react-router-dom';

const AdminTestPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Test Page</h1>
      <p className="mb-4">This is a test page to verify that admin routing is working correctly.</p>
      <Link to="/admin/samples" className="text-blue-500 hover:underline">
        Go to Samples Page
      </Link>
    </div>
  );
};

export default AdminTestPage; 