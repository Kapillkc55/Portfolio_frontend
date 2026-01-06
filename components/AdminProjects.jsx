import React, { useState, useEffect } from 'react';
import {
    FolderGit2, Plus, Edit, Trash2, Save, X, Upload,
    Github, ExternalLink, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProjects = () => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fullDescription: '',
        technologies: [''],
        githubUrl: '',
        liveUrl: '',
        gradient: 'from-violet-500 to-fuchsia-500',
        featured: false
    });

    const gradientOptions = [
        { value: 'from-violet-500 to-fuchsia-500', label: 'Purple to Pink', preview: 'from-violet-500 to-fuchsia-500' },
        { value: 'from-cyan-500 to-blue-500', label: 'Cyan to Blue', preview: 'from-cyan-500 to-blue-500' },
        { value: 'from-fuchsia-500 to-rose-500', label: 'Pink to Rose', preview: 'from-fuchsia-500 to-rose-500' },
        { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald', preview: 'from-green-500 to-emerald-500' },
        { value: 'from-orange-500 to-red-500', label: 'Orange to Red', preview: 'from-orange-500 to-red-500' },
        { value: 'from-indigo-500 to-violet-500', label: 'Indigo to Purple', preview: 'from-indigo-500 to-violet-500' }
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
            const data = await response.json();

            if (data.success) {
                setProjects(data.projects);
            } else {
                toast.error(data.message || 'Failed to fetch projects');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                fullDescription: project.fullDescription,
                technologies: project.technologies,
                githubUrl: project.githubUrl || '',
                liveUrl: project.liveUrl || '',
                gradient: project.gradient,
                featured: project.featured || false
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                fullDescription: '',
                technologies: [''],
                githubUrl: '',
                liveUrl: '',
                gradient: 'from-violet-500 to-fuchsia-500',
                featured: false
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.description || !formData.fullDescription) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Filter empty technologies
        const cleanedData = {
            ...formData,
            technologies: formData.technologies.filter(t => t.trim())
        };

        if (cleanedData.technologies.length === 0) {
            toast.error('Please add at least one technology');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingProject
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${editingProject._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;

            const response = await fetch(url, {
                method: editingProject ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                handleCloseModal();
                fetchProjects();
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (projectId, file) => {
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB');
            return;
        }

        setUploadingImage(true);
        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Project image uploaded successfully!');
                fetchProjects();
            } else {
                toast.error(data.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Project deleted successfully');
                fetchProjects();
            } else {
                toast.error(data.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    const addTechnology = () => {
        setFormData({
            ...formData,
            technologies: [...formData.technologies, '']
        });
    };

    const updateTechnology = (index, value) => {
        const newTech = [...formData.technologies];
        newTech[index] = value;
        setFormData({
            ...formData,
            technologies: newTech
        });
    };

    const removeTechnology = (index) => {
        const newTech = formData.technologies.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            technologies: newTech
        });
    };

    if (loading && projects.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FolderGit2 className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FolderGit2 className="w-7 h-7 text-violet-600" />
                                Projects Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Project
                        </button>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
                            <FolderGit2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No projects added yet</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Project
                            </button>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                                {/* Project Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`}></div>

                                    {/* Featured Badge */}
                                    {project.featured && (
                                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            Featured
                                        </div>
                                    )}

                                    {/* Upload Image Button */}
                                    <label className="absolute bottom-4 right-4 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(project._id, e.target.files[0])}
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-violet-500 hover:text-white transition-all text-sm font-medium shadow-lg">
                                            <Upload className="w-4 h-4" />
                                            {uploadingImage ? 'Uploading...' : 'Change'}
                                        </div>
                                    </label>
                                </div>

                                {/* Project Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 3).map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-violet-100 text-violet-700">
                                                +{project.technologies.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Links */}
                                    <div className="flex items-center gap-3 mb-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-violet-600"
                                            >
                                                <Github className="w-4 h-4" />
                                                GitHub
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-violet-600"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Live
                                            </a>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <button
                                            onClick={() => handleOpenModal(project)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingProject ? 'Edit Project' : 'Add New Project'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                        placeholder="E-Commerce Platform"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Short Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                        placeholder="Brief project description (1-2 sentences)"
                                        required
                                    />
                                </div>

                                {/* Full Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Description *
                                    </label>
                                    <textarea
                                        value={formData.fullDescription}
                                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                        placeholder="Detailed project description with features and capabilities"
                                        required
                                    />
                                </div>

                                {/* Technologies */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Technologies Used *
                                    </label>
                                    {formData.technologies.map((tech, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={tech}
                                                onChange={(e) => updateTechnology(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                                placeholder="React, Node.js, etc."
                                            />
                                            {formData.technologies.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTechnology(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addTechnology}
                                        className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        + Add Technology
                                    </button>
                                </div>

                                {/* URLs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Github className="w-4 h-4 inline mr-1" />
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                            placeholder="https://github.com/username/repo"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <ExternalLink className="w-4 h-4 inline mr-1" />
                                            Live URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.liveUrl}
                                            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                            placeholder="https://project-demo.com"
                                        />
                                    </div>
                                </div>

                                {/* Styling Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gradient Color
                                        </label>
                                        <select
                                            value={formData.gradient}
                                            onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                        >
                                            {gradientOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <div className={`mt-2 h-12 rounded-lg bg-gradient-to-r ${formData.gradient}`}></div>
                                    </div>
                                </div>

                                {/* Featured */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                                    />
                                    <label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        Mark as Featured Project
                                    </label>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400 transition-colors"
                                    >
                                        <Save className="w-5 h-5" />
                                        {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProjects;
