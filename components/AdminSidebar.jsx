import { useState } from 'react';
import { useRouter } from 'next/router';
import {
    LayoutDashboard,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Shield,
    Mail,
    BarChart3,
    User,
    Briefcase,
    FolderGit2,
    Phone,
    BookOpen
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    // Get user data from localStorage
    useState(() => {
        const userData = localStorage.getItem('adminUser');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'purple' },
        { id: 'about', icon: User, label: 'About Page', color: 'indigo' },
        { id: 'experience', icon: Briefcase, label: 'Experience', color: 'violet' },
        { id: 'projects', icon: FolderGit2, label: 'Projects', color: 'fuchsia' },
        { id: 'blog', icon: BookOpen, label: 'Blog Posts', color: 'teal' },
        { id: 'contact-info', icon: Phone, label: 'Contact Info', color: 'emerald' },
        { id: 'emails', icon: Mail, label: 'Emails', color: 'red' },
        { id: 'stats', icon: BarChart3, label: 'Statistics', color: 'cyan' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    return (
        <div className={`${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 shadow-2xl z-50 flex flex-col`}>
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                                <span className="text-xl font-bold">K</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Admin Panel</h2>
                                <p className="text-xs text-slate-400">Management Portal</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* User Info */}
                {!collapsed && user && (
                    <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="font-bold text-sm">{user.name?.[0]?.toUpperCase() || 'A'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user.name}</p>
                                <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3 text-purple-400" />
                                    <span className="text-xs text-purple-400 capitalize">{user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? `bg-${item.color}-600 text-white shadow-lg shadow-${item.color}-500/50`
                                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                                {!collapsed && (
                                    <span className="font-semibold">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-200"
                >
                    <LogOut className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                    {!collapsed && <span className="font-semibold">Logout</span>}
                </button>
            </div>
        </div>
    );
}
