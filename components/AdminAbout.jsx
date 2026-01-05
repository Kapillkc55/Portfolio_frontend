import React, { useState, useEffect } from 'react';
import {
    User, Briefcase, Award, Code, Plus, Edit, Trash2, Save, X,
    Sparkles, Target, Heart, Zap, Layers, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAbout = () => {
    const [loading, setLoading] = useState(false);
    const [about, setAbout] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [showAddExpertise, setShowAddExpertise] = useState(false);
    const [showAddTech, setShowAddTech] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // New items
    const [newExpertise, setNewExpertise] = useState({
        title: '',
        description: '',
        color: 'from-violet-500 to-fuchsia-500',
        icon: 'Zap'
    });

    const [newTech, setNewTech] = useState({
        name: '',
        icon: '',
        color: '#000000'
    });

    const iconOptions = ['Zap', 'Layers', 'Target', 'Heart', 'Code', 'Briefcase', 'Award'];
    const colorOptions = [
        'from-yellow-500 to-orange-500',
        'from-violet-500 to-fuchsia-500',
        'from-blue-500 to-cyan-500',
        'from-red-500 to-rose-500',
        'from-green-500 to-emerald-500',
        'from-indigo-500 to-violet-500'
    ];

    // Fetch about content
    const fetchAbout = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/about/');
            const data = await response.json();

            if (data.success) {
                setAbout(data.about);
            } else {
                toast.error(data.message || 'Failed to load content');
            }
        } catch (error) {
            console.error('Error fetching about:', error);
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    // Update main content
    const handleUpdateContent = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/about/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(about)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Content updated successfully!');
                fetchAbout();
            } else {
                toast.error(data.message || 'Failed to update content');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update content');
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setSelectedFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload profile image
    const handleUploadImage = async () => {
        if (!selectedFile) {
            toast.error('Please select an image first');
            return;
        }

        setUploadingImage(true);
        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch('http://localhost:5000/api/about/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Profile image updated successfully!');
                setSelectedFile(null);
                setPreviewUrl('');
                fetchAbout();
            } else {
                toast.error(data.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload image error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    // Add expertise
    const handleAddExpertise = async () => {
        if (!newExpertise.title || !newExpertise.description) {
            toast.error('Title and description are required');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/about/expertise', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newExpertise)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Expertise added successfully!');
                setShowAddExpertise(false);
                setNewExpertise({ title: '', description: '', color: 'from-violet-500 to-fuchsia-500', icon: 'Zap' });
                fetchAbout();
            } else {
                toast.error(data.message || 'Failed to add expertise');
            }
        } catch (error) {
            console.error('Add expertise error:', error);
            toast.error('Failed to add expertise');
        } finally {
            setLoading(false);
        }
    };

    // Delete expertise
    const handleDeleteExpertise = async (expertiseId) => {
        if (!confirm('Are you sure you want to delete this expertise?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/about/expertise/${expertiseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Expertise deleted successfully!');
                fetchAbout();
            } else {
                toast.error(data.message || 'Failed to delete expertise');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete expertise');
        } finally {
            setLoading(false);
        }
    };

    // Add technology
    const handleAddTechnology = async () => {
        if (!newTech.name || !newTech.icon) {
            toast.error('Name and icon are required');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/about/technology', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTech)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Technology added successfully!');
                setShowAddTech(false);
                setNewTech({ name: '', icon: '', color: '#000000' });
                fetchAbout();
            } else {
                toast.error(data.message || 'Failed to add technology');
            }
        } catch (error) {
            console.error('Add technology error:', error);
            toast.error('Failed to add technology');
        } finally {
            setLoading(false);
        }
    };

    // Upload technology icon
    const handleTechIconUpload = async (techId, file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('icon', file);

            const response = await fetch(`http://localhost:5000/api/about/technology/${techId}/upload-icon`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Technology icon uploaded successfully!');
                fetchAbout();
            } else {
                toast.error(data.message || 'Failed to upload icon');
            }
        } catch (error) {
            console.error('Upload tech icon error:', error);
            toast.error('Failed to upload icon');
        } finally {
            setLoading(false);
        }
    };

    // Delete technology
    const handleDeleteTechnology = async (techId) => {
        if (!confirm('Are you sure you want to delete this technology?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/about/technology/${techId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Technology deleted successfully!');
                fetchAbout();
            } else {
                toast.error(data.message || 'Failed to delete technology');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete technology');
        } finally {
            setLoading(false);
        }
    };

    if (!about) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="w-7 h-7 text-violet-600" />
                        About Page Management
                    </h1>
                    <p className="text-gray-600 mt-1">Manage all content on the About page</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'profile'
                                ? 'border-b-2 border-violet-600 text-violet-600'
                                : 'text-gray-600 hover:text-violet-600'
                                }`}
                        >
                            Profile & Bio
                        </button>
                        <button
                            onClick={() => setActiveTab('expertise')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'expertise'
                                ? 'border-b-2 border-violet-600 text-violet-600'
                                : 'text-gray-600 hover:text-violet-600'
                                }`}
                        >
                            Expertise
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'stats'
                                ? 'border-b-2 border-violet-600 text-violet-600'
                                : 'text-gray-600 hover:text-violet-600'
                                }`}
                        >
                            Statistics
                        </button>
                        <button
                            onClick={() => setActiveTab('technologies')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'technologies'
                                ? 'border-b-2 border-violet-600 text-violet-600'
                                : 'text-gray-600 hover:text-violet-600'
                                }`}
                        >
                            Technologies
                        </button>
                    </div>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={about.profile?.name || ''}
                                onChange={(e) => setAbout({
                                    ...about,
                                    profile: { ...about.profile, name: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        {/* Profile Image Upload */}
                        <div className="border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Image</label>

                            {/* Current Image */}
                            {about.profile?.imageUrl && !previewUrl && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                    <img
                                        src={about.profile.imageUrl}
                                        alt="Profile"
                                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                </div>
                            )}

                            {/* Preview Selected Image */}
                            {previewUrl && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-48 h-48 object-cover rounded-lg border-2 border-violet-300"
                                    />
                                </div>
                            )}

                            {/* File Input */}
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-violet-50 file:text-violet-700
                                        hover:file:bg-violet-100"
                                />
                                {selectedFile && (
                                    <button
                                        onClick={handleUploadImage}
                                        disabled={uploadingImage}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 whitespace-nowrap"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {uploadingImage ? 'Uploading...' : 'Upload'}
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Recommended: Square image, max 5MB. Supported formats: JPG, PNG, WebP
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status Text</label>
                            <input
                                type="text"
                                value={about.profile?.status?.text || ''}
                                onChange={(e) => setAbout({
                                    ...about,
                                    profile: {
                                        ...about.profile,
                                        status: { ...about.profile.status, text: e.target.value }
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                            <input
                                type="text"
                                value={about.profile?.badge || ''}
                                onChange={(e) => setAbout({
                                    ...about,
                                    profile: { ...about.profile, badge: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio Paragraphs</label>
                            {about.profile?.bio?.map((paragraph, index) => (
                                <div key={index} className="mb-3">
                                    <textarea
                                        value={paragraph}
                                        onChange={(e) => {
                                            const newBio = [...about.profile.bio];
                                            newBio[index] = e.target.value;
                                            setAbout({
                                                ...about,
                                                profile: { ...about.profile, bio: newBio }
                                            });
                                        }}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleUpdateContent}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}

                {/* Expertise Tab */}
                {activeTab === 'expertise' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Expertise Items</h2>
                            <button
                                onClick={() => setShowAddExpertise(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Expertise
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {about.expertise?.map((item) => (
                                <div key={item._id} className="bg-white rounded-lg shadow p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                                        <button
                                            onClick={() => handleDeleteExpertise(item._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className={`px-2 py-1 rounded bg-gradient-to-r ${item.color} text-white`}>
                                            {item.icon}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Expertise Modal */}
                        {showAddExpertise && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Add New Expertise</h3>
                                        <button onClick={() => setShowAddExpertise(false)}>
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={newExpertise.title}
                                                onChange={(e) => setNewExpertise({ ...newExpertise, title: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Description</label>
                                            <textarea
                                                value={newExpertise.description}
                                                onChange={(e) => setNewExpertise({ ...newExpertise, description: e.target.value })}
                                                rows="3"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Icon</label>
                                            <select
                                                value={newExpertise.icon}
                                                onChange={(e) => setNewExpertise({ ...newExpertise, icon: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                {iconOptions.map(icon => (
                                                    <option key={icon} value={icon}>{icon}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Color</label>
                                            <select
                                                value={newExpertise.color}
                                                onChange={(e) => setNewExpertise({ ...newExpertise, color: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                {colorOptions.map(color => (
                                                    <option key={color} value={color}>{color}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            onClick={handleAddExpertise}
                                            disabled={loading}
                                            className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                                        >
                                            {loading ? 'Adding...' : 'Add Expertise'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <div className="bg-white rounded-lg shadow p-6 space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Projects Value</label>
                                <input
                                    type="number"
                                    value={about.stats?.projects?.value || 0}
                                    onChange={(e) => setAbout({
                                        ...about,
                                        stats: {
                                            ...about.stats,
                                            projects: { ...about.stats.projects, value: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Value</label>
                                <input
                                    type="number"
                                    value={about.stats?.experience?.value || 0}
                                    onChange={(e) => setAbout({
                                        ...about,
                                        stats: {
                                            ...about.stats,
                                            experience: { ...about.stats.experience, value: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Satisfaction Value</label>
                                <input
                                    type="number"
                                    value={about.stats?.satisfaction?.value || 0}
                                    onChange={(e) => setAbout({
                                        ...about,
                                        stats: {
                                            ...about.stats,
                                            satisfaction: { ...about.stats.satisfaction, value: parseInt(e.target.value) }
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateContent}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Statistics'}
                        </button>
                    </div>
                )}

                {/* Technologies Tab */}
                {activeTab === 'technologies' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Technologies ({about.technologies?.length})</h2>
                            <button
                                onClick={() => setShowAddTech(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Technology
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {about.technologies?.map((tech) => (
                                <div key={tech._id} className="bg-white rounded-lg shadow p-4 text-center relative group">
                                    <button
                                        onClick={() => handleDeleteTechnology(tech._id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 z-10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Icon Display or Upload */}
                                    <div className="text-3xl mb-2 flex flex-col items-center gap-2">
                                        {tech.iconUrl ? (
                                            <img
                                                src={tech.iconUrl}
                                                alt={tech.name}
                                                className="w-12 h-12 object-contain"
                                            />
                                        ) : (
                                            <span>{tech.icon || '📦'}</span>
                                        )}

                                        {/* Upload Icon Button */}
                                        <label className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleTechIconUpload(tech._id, e.target.files[0])}
                                                className="hidden"
                                            />
                                            <div className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1">
                                                <Upload className="w-3 h-3" />
                                                Upload
                                            </div>
                                        </label>
                                    </div>

                                    <div className="text-sm font-medium">{tech.name}</div>
                                </div>
                            ))}
                        </div>

                        {/* Add Technology Modal */}
                        {showAddTech && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Add New Technology</h3>
                                        <button onClick={() => setShowAddTech(false)}>
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Name *</label>
                                            <input
                                                type="text"
                                                value={newTech.name}
                                                onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                                                placeholder="React"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Icon (emoji or text - optional)</label>
                                            <input
                                                type="text"
                                                value={newTech.icon}
                                                onChange={(e) => setNewTech({ ...newTech, icon: e.target.value })}
                                                placeholder="⚛️ or TS (can upload image after adding)"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Leave empty to upload an image icon after creating
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Color</label>
                                            <input
                                                type="color"
                                                value={newTech.color}
                                                onChange={(e) => setNewTech({ ...newTech, color: e.target.value })}
                                                className="w-full h-10 rounded-lg"
                                            />
                                        </div>

                                        <button
                                            onClick={handleAddTechnology}
                                            disabled={loading}
                                            className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                                        >
                                            {loading ? 'Adding...' : 'Add Technology'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAbout;
