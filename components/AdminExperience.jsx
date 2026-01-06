import React, { useState, useEffect } from 'react';
import {
    Briefcase, Plus, Edit, Trash2, Save, X, GripVertical,
    Calendar, MapPin, Award, Code
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminExperience = () => {
    const [loading, setLoading] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        type: 'Full-time',
        location: '',
        period: '',
        duration: '',
        description: '',
        achievements: [''],
        technologies: [''],
        gradient: 'from-violet-500 to-fuchsia-500',
        icon: '💼'
    });

    const typeOptions = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
    const gradientOptions = [
        { value: 'from-violet-500 to-fuchsia-500', label: 'Purple to Pink' },
        { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
        { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
        { value: 'from-orange-500 to-red-500', label: 'Orange to Red' },
        { value: 'from-indigo-500 to-violet-500', label: 'Indigo to Purple' },
        { value: 'from-fuchsia-500 to-rose-500', label: 'Pink to Rose' }
    ];

    const iconOptions = ['💼', '💻', '🎓', '⚡', '🏆', '📱', '🎨', '🔧', '📊'];

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experiences`);
            const data = await response.json();

            if (data.success) {
                setExperiences(data.experiences);
            } else {
                toast.error(data.message || 'Failed to fetch experiences');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (exp = null) => {
        if (exp) {
            setEditingExp(exp);
            setFormData({
                role: exp.role,
                company: exp.company,
                type: exp.type,
                location: exp.location,
                period: exp.period,
                duration: exp.duration,
                description: exp.description,
                achievements: exp.achievements,
                technologies: exp.technologies,
                gradient: exp.gradient,
                icon: exp.icon
            });
        } else {
            setEditingExp(null);
            setFormData({
                role: '',
                company: '',
                type: 'Full-time',
                location: '',
                period: '',
                duration: '',
                description: '',
                achievements: [''],
                technologies: [''],
                gradient: 'from-violet-500 to-fuchsia-500',
                icon: '💼'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingExp(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.role || !formData.company || !formData.location || !formData.period || !formData.duration || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Filter empty achievements and technologies
        const cleanedData = {
            ...formData,
            achievements: formData.achievements.filter(a => a.trim()),
            technologies: formData.technologies.filter(t => t.trim())
        };

        if (cleanedData.achievements.length === 0) {
            toast.error('Please add at least one achievement');
            return;
        }

        if (cleanedData.technologies.length === 0) {
            toast.error('Please add at least one technology');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingExp
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/experiences/${editingExp._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/experiences`;

            const response = await fetch(url, {
                method: editingExp ? 'PUT' : 'POST',
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
                fetchExperiences();
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

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experiences/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Experience deleted successfully');
                fetchExperiences();
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

    const addArrayField = (field) => {
        setFormData({
            ...formData,
            [field]: [...formData[field], '']
        });
    };

    const updateArrayField = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    const removeArrayField = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    if (loading && experiences.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Briefcase className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading experiences...</p>
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
                                <Briefcase className="w-7 h-7 text-violet-600" />
                                Experience Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your work experience and internships</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Experience
                        </button>
                    </div>
                </div>

                {/* Experiences Grid */}
                <div className="grid gap-6">
                    {experiences.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No experiences added yet</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Experience
                            </button>
                        </div>
                    ) : (
                        experiences.map((exp) => (
                            <div key={exp._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${exp.gradient} flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                                            {exp.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-800">{exp.role}</h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${exp.type === 'Internship'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-violet-100 text-violet-700'
                                                    }`}>
                                                    {exp.type}
                                                </span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-700 mb-3">{exp.company}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-violet-500" />
                                                    {exp.period}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-violet-500" />
                                                    {exp.location}
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-4">{exp.description}</p>

                                            <div className="mb-4">
                                                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                    <Award className="w-4 h-4 text-violet-500" />
                                                    Achievements ({exp.achievements.length})
                                                </h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    {exp.achievements.slice(0, 2).map((achievement, idx) => (
                                                        <li key={idx}>{achievement}</li>
                                                    ))}
                                                    {exp.achievements.length > 2 && (
                                                        <li className="text-violet-600">+ {exp.achievements.length - 2} more</li>
                                                    )}
                                                </ul>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {exp.technologies.map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleOpenModal(exp)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
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
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingExp ? 'Edit Experience' : 'Add New Experience'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role / Position *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                            placeholder="Senior Full Stack Developer"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                            placeholder="Tech Innovations Inc."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type *
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                        >
                                            {typeOptions.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                            placeholder="Kathmandu, Nepal"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Period *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.period}
                                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                            placeholder="Jan 2024 - Present"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                            placeholder="1 year"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                        placeholder="Brief description of your role and responsibilities"
                                        required
                                    />
                                </div>

                                {/* Achievements */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Achievements *
                                    </label>
                                    {formData.achievements.map((achievement, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={achievement}
                                                onChange={(e) => updateArrayField('achievements', index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                                placeholder="Key achievement or milestone"
                                            />
                                            {formData.achievements.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayField('achievements', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayField('achievements')}
                                        className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        + Add Achievement
                                    </button>
                                </div>

                                {/* Technologies */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Technologies *
                                    </label>
                                    {formData.technologies.map((tech, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={tech}
                                                onChange={(e) => updateArrayField('technologies', index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                                                placeholder="React, Node.js, etc."
                                            />
                                            {formData.technologies.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayField('technologies', index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayField('technologies')}
                                        className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        + Add Technology
                                    </button>
                                </div>

                                {/* Styling */}
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Icon
                                        </label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {iconOptions.map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon })}
                                                    className={`p-3 text-2xl rounded-lg border-2 transition-all ${formData.icon === icon
                                                        ? 'border-violet-500 bg-violet-50'
                                                        : 'border-gray-200 hover:border-violet-300'
                                                        }`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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
                                        {loading ? 'Saving...' : editingExp ? 'Update Experience' : 'Add Experience'}
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

export default AdminExperience;
