import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminContactInfo() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        location: ''
    });

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/contact-info');
            const data = await response.json();

            if (data.success) {
                setContactInfo({
                    email: data.contactInfo.email,
                    phone: data.contactInfo.phone,
                    location: data.contactInfo.location
                });
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
            toast.error('Failed to load contact information');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/contact-info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(contactInfo)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Contact information updated successfully!');
                fetchContactInfo();
            } else {
                toast.error(data.message || 'Failed to update contact information');
            }
        } catch (error) {
            console.error('Error updating contact info:', error);
            toast.error('Failed to update contact information');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setContactInfo({
            ...contactInfo,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    <p className="text-gray-600 mt-1">Manage the contact details displayed on your portfolio</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 text-purple-600" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={contactInfo.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="your.email@example.com"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={contactInfo.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="+1 234 567 8900"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={contactInfo.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="City, Country"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="space-y-4">
                    {/* Email Preview */}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-purple-600">Email</p>
                            <p className="text-sm text-gray-900 font-medium">{contactInfo.email}</p>
                        </div>
                    </div>

                    {/* Phone Preview */}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-blue-600">Phone</p>
                            <p className="text-sm text-gray-900 font-medium">{contactInfo.phone}</p>
                        </div>
                    </div>

                    {/* Location Preview */}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-green-600">Location</p>
                            <p className="text-sm text-gray-900 font-medium">{contactInfo.location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
