import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AdminLayout from '@components/admin/AdminLayout';

export default function AdminBlog() {
  const [loading, setLoading] = useState(false); 

  return (
    <AdminLayout title="Blog">
      <Helmet>
        <title>Blog - Administration JUDCD</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Blog en développement</h3>
          <p className="text-gray-600 mb-6">La fonctionnalité blog sera bientôt disponible.</p>
          <p className="text-sm text-gray-500 mb-6">Cette section permettra de gérer les articles du blog JUDCD.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Coming soon</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
