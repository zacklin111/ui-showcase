import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function UploadDesign({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    figma_link: '',
    preview_image: null,
    category: 'mobile',
    tags: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 首先上传图片到S3或其他存储服务
      const imageUrl = await uploadImage(formData.preview_image);
      
      // 创建设计记录
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          preview_image_url: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create design');
      }

      onClose();
      onUpload();
    } catch (error) {
      console.error('Error uploading design:', error);
    }
  };

  const uploadImage = async (file) => {
    // 这里实现图片上传逻辑
    // 返回上传后的URL
    return 'https://example.com/image.jpg';
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <Dialog.Title className="text-2xl font-bold mb-6">Upload New Design</Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Figma Link</label>
                <input
                  type="url"
                  value={formData.figma_link}
                  onChange={(e) => setFormData({ ...formData, figma_link: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preview Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, preview_image: e.target.files[0] })}
                  className="mt-1 block w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="web">Web</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
} 