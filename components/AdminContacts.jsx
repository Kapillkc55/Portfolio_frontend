import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    Mail,
    Calendar,
    MessageSquare,
    Reply,
    Trash2,
    Eye,
    Archive,
    CheckCircle,
    Clock,
    X,
    Send,
    Loader2
} from 'lucide-react';

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchContacts();
        fetchStats();
    }, [filterStatus]);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const url = filterStatus === 'all'
                ? 'http://localhost:5000/api/contacts'
                : `http://localhost:5000/api/contacts?status=${filterStatus}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/contacts/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleViewContact = async (contact) => {
        setSelectedContact(contact);

        // Mark as read if pending
        if (contact.status === 'pending') {
            const token = localStorage.getItem('adminToken');
            await fetch(`http://localhost:5000/api/contacts/${contact._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchContacts();
            fetchStats();
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        setReplyLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/contacts/${selectedContact._id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: replyMessage })
            });

            if (response.ok) {
                toast.success('✅ Reply sent successfully to user!', {
                    duration: 3000,
                    position: 'top-center',
                });
                setReplyMessage('');
                setSelectedContact(null);
                fetchContacts();
                fetchStats();
            } else {
                toast.error('❌ Failed to send reply. Please try again.', {
                    duration: 3000,
                    position: 'top-center',
                });
            }
        } catch (error) {
            toast.error('❌ Network error. Failed to send reply.', {
                duration: 3000,
                position: 'top-center',
            });
        } finally {
            setReplyLoading(false);
        }
    };

    const handleDelete = async (contactId) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/contacts/${contactId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('🗑️ Contact deleted successfully!', {
                    duration: 3000,
                    position: 'top-center',
                });
                fetchContacts();
                fetchStats();
                setSelectedContact(null);
            } else {
                toast.error('❌ Failed to delete contact.', {
                    duration: 3000,
                    position: 'top-center',
                });
            }
        } catch (error) {
            toast.error('❌ Network error. Failed to delete contact.', {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const handleUpdateStatus = async (contactId, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/contacts/${contactId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast.success(`✅ Status updated to "${status}"`, {
                    duration: 2000,
                    position: 'top-center',
                });
                fetchContacts();
                fetchStats();
            } else {
                toast.error('❌ Failed to update status.', {
                    duration: 3000,
                    position: 'top-center',
                });
            }
        } catch (error) {
            toast.error('❌ Network error. Failed to update status.', {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            read: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Eye },
            replied: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            archived: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Archive }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
        );
    }

    return (
        <div>
            <Toaster />
            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Contacts</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                        <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{stats.replied}</div>
                        <div className="text-sm text-green-600">Replied</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{stats.recentContacts}</div>
                        <div className="text-sm text-blue-600">Last 7 Days</div>
                    </div>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'read', 'replied', 'archived'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${filterStatus === status
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Contacts List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {contacts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No contacts found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {contacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleViewContact(contact)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                                            {getStatusBadge(contact.status)}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{contact.email}</p>
                                        <p className="text-sm text-gray-500 line-clamp-2">{contact.message}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            {contact.meetingTime && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Meeting: {new Date(contact.meetingTime).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span>
                                                Received: {new Date(contact.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h2>
                                <p className="text-gray-600">{selectedContact.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Status */}
                            <div className="mb-4">
                                {getStatusBadge(selectedContact.status)}
                            </div>

                            {/* Meeting Time */}
                            {selectedContact.meetingTime && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Preferred Meeting Time
                                    </div>
                                    <p className="text-blue-900">
                                        {new Date(selectedContact.meetingTime).toLocaleString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            timeZone: 'Asia/Kathmandu'
                                        })} (Nepal Time)
                                    </p>
                                    {selectedContact.meetingType && (
                                        <p className="text-blue-800 mt-2 font-medium">
                                            {selectedContact.meetingType === 'online' ? '🌐 Online Meeting (Zoom/Meet)' : '🤝 In-Person Meeting (Kathmandu)'}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Message */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Message
                                </div>
                                <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                            </div>

                            {/* Previous Reply */}
                            {selectedContact.adminReply && (
                                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Your Reply
                                    </div>
                                    <p className="text-gray-900 whitespace-pre-wrap mb-2">{selectedContact.adminReply.message}</p>
                                    <p className="text-xs text-green-600">
                                        Sent on {new Date(selectedContact.adminReply.repliedAt).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* Reply Form */}
                            <form onSubmit={handleReply} className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {selectedContact.adminReply ? 'Send Another Reply' : 'Reply to Contact'}
                                </label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows="4"
                                    placeholder="Type your reply message..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none resize-none"
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={replyLoading || !replyMessage.trim()}
                                    className="mt-2 w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {replyLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus(selectedContact._id, 'archived')}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Archive className="w-4 h-4" />
                                    Archive
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedContact._id)}
                                    className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
