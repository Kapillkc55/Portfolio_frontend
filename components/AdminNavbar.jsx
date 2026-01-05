import { Bell, Search, Moon, Sun, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminNavbar() {
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('adminUser');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
            {/* Left Section - Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users, images, logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-4 ml-8">
                {/* Theme Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    {darkMode ? (
                        <Sun className="w-5 h-5 text-gray-600" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors relative">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
