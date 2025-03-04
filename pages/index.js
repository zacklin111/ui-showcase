import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import UploadDesign from '../components/UploadDesign';

export default function Home() {
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/designs');
      if (!response.ok) {
        throw new Error('Failed to fetch designs');
      }
      const data = await response.json();
      setDesigns(data);
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDesigns = designs.filter(design => {
    if (filter === 'all') return true;
    return design.category === filter;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>UI Showcase - Inspired by Mobbin</title>
        <meta name="description" content="A collection of beautiful UI designs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header with Upload Button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">UI Showcase</h1>
            <p className="mt-2 text-gray-600">Discover and explore beautiful UI designs</p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Upload Design
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === 'mobile' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setFilter('mobile')}
            >
              Mobile
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === 'web' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setFilter('web')}
            >
              Web
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading designs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDesigns.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No designs found. Be the first to upload!</p>
          </div>
        )}

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative pb-[75%]">
                <img
                  src={design.imageUrl}
                  alt={design.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{design.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{design.description}</p>
                {design.figma_link && (
                  <a
                    href={design.figma_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-blue-500 hover:text-blue-600"
                  >
                    View in Figma
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Upload Dialog */}
      <UploadDesign
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={fetchDesigns}
      />
    </div>
  );
} 