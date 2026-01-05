import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import AdminContacts from '../../components/AdminContacts';
import AdminStats from '../../components/AdminStats';
import AdminImages from '../../components/AdminImages';
import AdminAbout from '../../components/AdminAbout';
import AdminExperience from '../../components/AdminExperience';
import AdminProjects from '../../components/AdminProjects';
import AdminContactInfo from '../../components/AdminContactInfo';
import AdminBlogs from '../../components/AdminBlogs';
import { Users, Image, Activity, Shield, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalImages: 0,
        totalRequests: 0,
        activeUsers: 0
    });

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');

        if (!token || !userData) {
            router.push('/admin/login');
            return;
        }

        const parsedUser = JSON.parse(userData);

        // Check if user is admin or moderator
        if (parsedUser.role !== 'admin' && parsedUser.role !== 'moderator') {
            router.push('/');
            return;
        }

        setUser(parsedUser);

        // Fetch stats
        fetchStats(token);
    }, [router]);

    const fetchStats = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="ml-72">
                <AdminNavbar />

                <main className="p-8">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {user.name}! 👋
                        </h1>
                        <p className="text-gray-600">Here's what's happening with your portfolio today.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Users */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-violet-600" />
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    +12%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers || 0}</h3>
                            <p className="text-sm text-gray-600">Total Users</p>
                        </div>

                        {/* Total Images */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center">
                                    <Image className="w-6 h-6 text-fuchsia-600" />
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    +8%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalImages || 0}</h3>
                            <p className="text-sm text-gray-600">Total Images</p>
                        </div>

                        {/* Total Requests */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    +24%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRequests || 0}</h3>
                            <p className="text-sm text-gray-600">Total Requests</p>
                        </div>

                        {/* Active Users */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    +5%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.activeUsers || 0}</h3>
                            <p className="text-sm text-gray-600">Active Users</p>
                        </div>
                    </div>

                    {/* Content Area Based on Active Tab */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        {activeTab === 'dashboard' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-violet-600" />
                                            <div>
                                                <h3 className="font-semibold text-violet-900">System Status</h3>
                                                <p className="text-sm text-violet-700">All systems operational</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <h3 className="font-semibold text-blue-900">Recent Activity</h3>
                                                <p className="text-sm text-blue-700">Last cron job: 2 minutes ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
                                <p className="text-gray-600">User management features coming soon...</p>
                            </div>
                        )}

                        {activeTab === 'images' && (
                            <div>
                                <AdminImages />
                            </div>
                        )}

                        {activeTab === 'logs' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">System Logs</h2>
                                <p className="text-gray-600">Log viewer coming soon...</p>
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Request Logs</h2>
                                <p className="text-gray-600">Request monitoring coming soon...</p>
                            </div>
                        )}

                        {activeTab === 'emails' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Messages</h2>
                                <AdminContacts />
                            </div>
                        )}

                        {activeTab === 'stats' && (
                            <div>
                                <AdminStats />
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div>
                                <AdminAbout />
                            </div>
                        )}

                        {activeTab === 'experience' && (
                            <div>
                                <AdminExperience />
                            </div>
                        )}

                        {activeTab === 'projects' && (
                            <div>
                                <AdminProjects />
                            </div>
                        )}

                        {activeTab === 'blog' && (
                            <div>
                                <AdminBlogs />
                            </div>
                        )}

                        {activeTab === 'contact-info' && (
                            <div>
                                <AdminContactInfo />
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
                                <p className="text-gray-600">Configuration settings coming soon...</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
