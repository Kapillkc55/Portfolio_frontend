import React, { useState, useEffect } from 'react';
import {
    Upload, Image as ImageIcon, Trash2, Edit, Eye, X, Save,
    Search, Filter, Grid, List, Plus, Download, Tag, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [stats, setStats] = useState({ total: 0, active: 0, byCategory: {} });
    const [selectedImages, setSelectedImages] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        isActive: '',
        page: 1,
        limit: 20
    });

    // Upload form
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        category: 'portfolio',
        tags: '',
        altText: '',
        caption: '',
        credit: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const categories = ['project', 'portfolio', 'hero', 'about', 'testimonial', 'other'];

    // Fetch images
    const fetchImages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const queryParams = new URLSearchParams();

            Object.keys(filters).forEach(key => {
                if (filters[key]) queryParams.append(key, filters[key]);
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setImages(data.images);
            } else {
                toast.error(data.message || 'Failed to load images');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            toast.error('Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchImages();
        fetchStats();
    }, [filters]);

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should not exceed 10MB');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Upload image
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please select an image file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', uploadData.title);
        formData.append('description', uploadData.description);
        formData.append('category', uploadData.category);
        formData.append('tags', JSON.stringify(uploadData.tags.split(',').map(t => t.trim()).filter(t => t)));
        formData.append('altText', uploadData.altText);
        formData.append('caption', uploadData.caption);
        formData.append('credit', uploadData.credit);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Image uploaded successfully!');
                setShowUploadModal(false);
                resetUploadForm();
                fetchImages();
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    // Update image
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${selectedImage._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: selectedImage.title,
                    description: selectedImage.description,
                    category: selectedImage.category,
                    tags: JSON.stringify(selectedImage.tags || []),
                    altText: selectedImage.metadata?.altText,
                    caption: selectedImage.metadata?.caption,
                    credit: selectedImage.metadata?.credit,
                    isActive: selectedImage.isActive
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Image updated successfully!');
                setShowEditModal(false);
                fetchImages();
            } else {
                toast.error(data.message || 'Failed to update image');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update image');
        } finally {
            setLoading(false);
        }
    };

    // Delete image
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Image deleted successfully!');
                fetchImages();
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to delete image');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete image');
        } finally {
            setLoading(false);
        }
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        if (selectedImages.length === 0) {
            toast.error('No images selected');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/bulk-delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageIds: selectedImages })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setSelectedImages([]);
                fetchImages();
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to delete images');
            }
        } catch (error) {
            console.error('Bulk delete error:', error);
            toast.error('Failed to delete images');
        } finally {
            setLoading(false);
        }
    };

    const resetUploadForm = () => {
        setUploadData({
            title: '',
            description: '',
            category: 'portfolio',
            tags: '',
            altText: '',
            caption: '',
            credit: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const toggleImageSelection = (id) => {
        setSelectedImages(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <ImageIcon className="w-7 h-7 text-violet-600" />
                            Image Management
                        </h1>
                        <p className="text-gray-600 mt-1">Upload and manage portfolio images on Cloudinary</p>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Upload Image
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Images</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <ImageIcon className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Active</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <Check className="w-10 h-10 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Projects</p>
                                <p className="text-2xl font-bold text-violet-600">{stats.byCategory?.project || 0}</p>
                            </div>
                            <Grid className="w-10 h-10 text-violet-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Portfolio</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.byCategory?.portfolio || 0}</p>
                            </div>
                            <ImageIcon className="w-10 h-10 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Filters and View Controls */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search images..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filters.isActive}
                            onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value, page: 1 }))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                        {/* View Mode */}
                        <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Bulk Actions */}
                        {selectedImages.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete ({selectedImages.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Images Display */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading images...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No images found</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                        >
                            Upload Your First Image
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map(image => (
                            <div key={image._id} className="bg-white rounded-lg shadow overflow-hidden group relative">
                                <div className="aspect-square relative">
                                    <img
                                        src={image.url}
                                        alt={image.metadata?.altText || image.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => {
                                                setSelectedImage(image);
                                                setShowImagePreview(true);
                                            }}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                        >
                                            <Eye className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedImage(image);
                                                setShowEditModal(true);
                                            }}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                        >
                                            <Edit className="w-5 h-5 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(image._id)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.includes(image._id)}
                                        onChange={() => toggleImageSelection(image._id)}
                                        className="absolute top-2 left-2 w-5 h-5 cursor-pointer"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-800 truncate">{image.title}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-gray-500 capitalize">{image.category}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${image.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {image.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        <input
                                            type="checkbox"
                                            checked={selectedImages.length === images.length}
                                            onChange={() => {
                                                if (selectedImages.length === images.length) {
                                                    setSelectedImages([]);
                                                } else {
                                                    setSelectedImages(images.map(img => img._id));
                                                }
                                            }}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {images.map(image => (
                                    <tr key={image._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedImages.includes(image._id)}
                                                onChange={() => toggleImageSelection(image._id)}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={image.url}
                                                alt={image.title}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-800">{image.title}</p>
                                                <p className="text-sm text-gray-500 truncate max-w-xs">{image.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm capitalize">{image.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${image.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {image.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(image.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedImage(image);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(image._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-violet-600" />
                                    Upload New Image
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        resetUploadForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="p-6">
                                {/* File Upload */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image File *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                    />
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="mt-3 w-full h-48 object-cover rounded-lg"
                                        />
                                    )}
                                </div>

                                {/* Title */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadData.title}
                                        onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={uploadData.description}
                                        onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={uploadData.category}
                                        onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadData.tags}
                                        onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                                        placeholder="react, nextjs, portfolio"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                {/* Alt Text */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alt Text
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadData.altText}
                                        onChange={(e) => setUploadData({ ...uploadData, altText: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Upload className="w-5 h-5" />
                                    {loading ? 'Uploading...' : 'Upload Image'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && selectedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">Edit Image</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-6">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={selectedImage.title}
                                        onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={selectedImage.description}
                                        onChange={(e) => setSelectedImage({ ...selectedImage, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={selectedImage.category}
                                        onChange={(e) => setSelectedImage({ ...selectedImage, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedImage.isActive}
                                            onChange={(e) => setSelectedImage({ ...selectedImage, isActive: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                                >
                                    <Save className="w-5 h-5" />
                                    {loading ? 'Updating...' : 'Update Image'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Image Preview Modal */}
                {showImagePreview && selectedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                        <div className="relative max-w-5xl w-full">
                            <button
                                onClick={() => setShowImagePreview(false)}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                            />
                            <div className="bg-white rounded-lg mt-4 p-4">
                                <h3 className="font-bold text-lg">{selectedImage.title}</h3>
                                <p className="text-gray-600">{selectedImage.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminImages;
