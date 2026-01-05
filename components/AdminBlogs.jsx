import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff, Star, Calendar, Clock, Tag, Github, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        problemStatement: '',
        techStack: [''],
        architecture: '',
        implementation: '',
        challenges: '',
        learnings: '',
        githubUrl: '',
        liveUrl: '',
        project: '',
        tags: [''],
        readTime: 5,
        featured: false,
        isPublished: false
    });

    useEffect(() => {
        fetchBlogs();
        fetchProjects();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/blogs/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/projects');
            const data = await response.json();

            if (data.success) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleOpenModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                excerpt: blog.excerpt,
                problemStatement: blog.problemStatement,
                techStack: blog.techStack,
                architecture: blog.architecture,
                implementation: blog.implementation,
                challenges: blog.challenges,
                learnings: blog.learnings,
                githubUrl: blog.githubUrl || '',
                liveUrl: blog.liveUrl || '',
                project: blog.project?._id || '',
                tags: blog.tags.length > 0 ? blog.tags : [''],
                readTime: blog.readTime,
                featured: blog.featured,
                isPublished: blog.isPublished
            });
        } else {
            setEditingBlog(null);
            setFormData({
                title: '',
                excerpt: '',
                problemStatement: '',
                techStack: [''],
                architecture: '',
                implementation: '',
                challenges: '',
                learnings: '',
                githubUrl: '',
                liveUrl: '',
                project: '',
                tags: [''],
                readTime: 5,
                featured: false,
                isPublished: false
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Filter out empty strings
        const cleanedTechStack = formData.techStack.filter(t => t.trim());
        const cleanedTags = formData.tags.filter(t => t.trim());

        if (cleanedTechStack.length === 0) {
            toast.error('Add at least one technology');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const url = editingBlog
                ? `http://localhost:5000/api/blogs/${editingBlog._id}`
                : 'http://localhost:5000/api/blogs';

            const response = await fetch(url, {
                method: editingBlog ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    techStack: cleanedTechStack,
                    tags: cleanedTags
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(editingBlog ? 'Blog updated!' : 'Blog created!');
                setShowModal(false);
                fetchBlogs();
            } else {
                toast.error(data.message || 'Failed to save blog');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
            toast.error('Failed to save blog');
        }
    };

    const handleImageUpload = async (blogId, file) => {
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/blogs/${blogId}/upload-cover`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Cover image uploaded!');
                fetchBlogs();
            } else {
                toast.error(data.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Blog deleted!');
                fetchBlogs();
            } else {
                toast.error(data.message || 'Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete blog');
        }
    };

    const addField = (field) => {
        setFormData({
            ...formData,
            [field]: [...formData[field], '']
        });
    };

    const removeField = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    const updateField = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
                    <p className="text-gray-600 mt-1">Manage your project case studies and technical blogs</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Blog Post
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No blog posts yet</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                        Create Your First Blog Post
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                {/* Cover Image */}
                                <div className="relative w-full md:w-64 h-48 bg-gray-100">
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer px-4 py-2 bg-white text-gray-900 rounded-lg flex items-center gap-2 hover:bg-gray-100">
                                            <Upload className="w-4 h-4" />
                                            Change
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(blog._id, e.target.files[0])}
                                            />
                                        </label>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {blog.featured && (
                                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" />
                                                Featured
                                            </span>
                                        )}
                                        {blog.isPublished ? (
                                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                Published
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded flex items-center gap-1">
                                                <EyeOff className="w-3 h-3" />
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{blog.excerpt}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleOpenModal(blog)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {blog.readTime} min read
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {blog.views} views
                                        </span>
                                        {blog.publishedAt && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(blog.publishedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {blog.techStack.slice(0, 5).map((tech, index) => (
                                            <span key={index} className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded">
                                                {tech}
                                            </span>
                                        ))}
                                        {blog.techStack.length > 5 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                +{blog.techStack.length - 5} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {blog.tags.map((tag, index) => (
                                                <span key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="flex gap-3">
                                        {blog.githubUrl && (
                                            <a
                                                href={blog.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                                            >
                                                <Github className="w-4 h-4" />
                                                GitHub
                                            </a>
                                        )}
                                        {blog.liveUrl && (
                                            <a
                                                href={blog.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="E.g., Building a Real-Time Chat Application"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Excerpt <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        required
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                        placeholder="Brief description that appears in blog listings..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Structured Content */}
                            <div className="space-y-6 border-t pt-6">
                                <h4 className="font-semibold text-gray-900">Blog Content Structure</h4>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Problem Statement <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.problemStatement}
                                        onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                        placeholder="Describe the problem this project solves..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tech Stack <span className="text-red-500">*</span>
                                    </label>
                                    {formData.techStack.map((tech, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={tech}
                                                onChange={(e) => updateField('techStack', index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                                placeholder="E.g., React, Node.js, MongoDB"
                                            />
                                            {formData.techStack.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeField('techStack', index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addField('techStack')}
                                        className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                                    >
                                        + Add Technology
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Architecture Overview <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.architecture}
                                        onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                        placeholder="Explain the system architecture..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Implementation Details <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.implementation}
                                        onChange={(e) => setFormData({ ...formData, implementation: e.target.value })}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                        placeholder="Technical implementation details, key features, code snippets..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Challenges & Solutions <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.challenges}
                                        onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                        placeholder="Problems faced and how you solved them..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Key Learnings <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.learnings}
                                        onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                        placeholder="What did you learn from this project?"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Links & Metadata */}
                            <div className="space-y-6 border-t pt-6">
                                <h4 className="font-semibold text-gray-900">Links & Metadata</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Live Demo URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.liveUrl}
                                            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Related Project
                                    </label>
                                    <select
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    >
                                        <option value="">-- Select Project --</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                                {project.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    {formData.tags.map((tag, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={tag}
                                                onChange={(e) => updateField('tags', index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                                placeholder="E.g., Web Development, Full Stack"
                                            />
                                            {formData.tags.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeField('tags', index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addField('tags')}
                                        className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                                    >
                                        + Add Tag
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Read Time (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.readTime}
                                        onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Featured Post</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPublished}
                                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                            className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Publish Immediately</span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingBlog ? 'Update Blog' : 'Create Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
