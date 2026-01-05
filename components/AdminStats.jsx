import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, History, RotateCcw, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminStats = () => {
    const [stats, setStats] = useState({
        completedProjects: 15,
        ongoingProjects: 3,
        happyClients: 20,
        yearsExperience: 0
    });
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);

    // Fetch current stats
    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/project-stats/', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success && data.stats) {
                setStats({
                    completedProjects: data.stats.completedProjects,
                    ongoingProjects: data.stats.ongoingProjects,
                    happyClients: data.stats.happyClients,
                    yearsExperience: data.stats.yearsExperience
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load statistics');
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseInt(value) || 0;

        if (numValue < 0) {
            toast.error('Value cannot be negative');
            return;
        }

        setStats(prev => ({
            ...prev,
            [name]: numValue
        }));
    };

    // Update stats
    const handleUpdate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch('http://localhost:5000/api/project-stats/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(stats)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Statistics updated successfully!');
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to update statistics');
            }
        } catch (error) {
            console.error('Error updating stats:', error);
            toast.error('Failed to update statistics');
        } finally {
            setLoading(false);
        }
    };

    // Reset to defaults
    const handleReset = async () => {
        if (!confirm('Are you sure you want to reset statistics to default values?')) {
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch('http://localhost:5000/api/project-stats/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Statistics reset to default values!');
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to reset statistics');
            }
        } catch (error) {
            console.error('Error resetting stats:', error);
            toast.error('Failed to reset statistics');
        } finally {
            setLoading(false);
        }
    };

    // Fetch history
    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch('http://localhost:5000/api/project-stats/history?page=1&limit=10', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setHistory(data.history || []);
                setShowHistory(true);
            } else {
                toast.error(data.message || 'Failed to load history');
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Failed to load history');
            setHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-blue-600" />
                        Project Statistics Management
                    </h1>
                    <p className="text-gray-600 mt-1">Update the statistics displayed on your portfolio hero section</p>
                </div>

                {/* Stats Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Completed Projects */}
                        <div>
                            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                                <Award className="w-4 h-4 text-green-600" />
                                Completed Projects
                            </label>
                            <input
                                type="number"
                                name="completedProjects"
                                value={stats.completedProjects}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Years Experience */}
                        <div>
                            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-orange-600" />
                                Years Experience
                            </label>
                            <input
                                type="number"
                                name="ongoingProjects"
                                value={stats.ongoingProjects}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Happy Clients */}
                        <div>
                            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                                <Users className="w-4 h-4 text-purple-600" />
                                Happy Clients
                            </label>
                            <input
                                type="number"
                                name="happyClients"
                                value={stats.happyClients}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Years of Experience */}
                        <div>
                            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-blue-600" />
                                Years of Experience
                            </label>
                            <input
                                type="number"
                                name="yearsExperience"
                                value={stats.yearsExperience}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Updating...' : 'Update Statistics'}
                        </button>

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset to Defaults
                        </button>

                        <button
                            onClick={fetchHistory}
                            disabled={historyLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <History className="w-4 h-4" />
                            View History
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
                    <h2 className="text-lg font-semibold mb-4">Preview (How it will appear on hero section)</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold">{stats.completedProjects}+</p>
                            <p className="text-sm mt-1 opacity-90">Completed Projects</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">{stats.ongoingProjects}</p>
                            <p className="text-sm mt-1 opacity-90">Years Experience</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">{stats.happyClients}+</p>
                            <p className="text-sm mt-1 opacity-90">Happy Clients</p>
                        </div>
                    </div>
                </div>

                {/* History Modal */}
                {showHistory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <History className="w-5 h-5 text-purple-600" />
                                    Statistics History
                                </h2>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* History List */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {!history || history.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No history found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {history.map((record) => (
                                            <div
                                                key={record._id}
                                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="text-sm text-gray-600">
                                                        Updated by: <span className="font-medium text-gray-800">
                                                            {record.updatedBy?.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(record.updatedAt).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                                    <div className="bg-green-50 rounded p-2">
                                                        <p className="text-xs text-gray-600">Completed</p>
                                                        <p className="text-lg font-semibold text-green-700">{record.completedProjects}</p>
                                                    </div>
                                                    <div className="bg-orange-50 rounded p-2">
                                                        <p className="text-xs text-gray-600">Ongoing</p>
                                                        <p className="text-lg font-semibold text-orange-700">{record.ongoingProjects}</p>
                                                    </div>
                                                    <div className="bg-purple-50 rounded p-2">
                                                        <p className="text-xs text-gray-600">Clients</p>
                                                        <p className="text-lg font-semibold text-purple-700">{record.happyClients}</p>
                                                    </div>
                                                    <div className="bg-blue-50 rounded p-2">
                                                        <p className="text-xs text-gray-600">Years</p>
                                                        <p className="text-lg font-semibold text-blue-700">{record.yearsExperience}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStats;
