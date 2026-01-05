import { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/contacts/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Message sent successfully! Check your email for confirmation.', {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                    },
                });

                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });

                // Reset success message after 5 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } else {
                toast.error(data.message || 'Failed to send message. Please try again.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                    },
                });
                setError(data.message || 'Failed to send message');
            }
        } catch (err) {
            toast.error(' Network error. Please check your connection and try again.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                },
            });
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-12 text-center border-2 border-green-200">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully! 🎉</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for reaching out! I've received your message and will get back to you as soon as possible.
                    </p>
                    <p className="text-sm text-gray-500">
                        Check your email for a confirmation message.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <Toaster />
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Let's Connect</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Drop me a message and I'll get back to you soon
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                        <span>❌</span>
                        {error}
                    </div>
                )}

                {/* Name Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Message Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Message <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-gray-400" />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Tell me about your project..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Send Message
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    🔒 Your information is secure and will never be shared with third parties.
                </p>
            </form>
        </div>
    );
}
