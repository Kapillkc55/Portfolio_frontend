import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/submit`, {
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-slate-200">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-green-200">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully! 🎉</h2>
                    <p className="text-gray-600 mb-4 text-sm">
                        Thank you for reaching out! I've received your message and will get back to you as soon as possible.
                    </p>
                    <p className="text-xs text-gray-500">
                        Check your email for a confirmation message.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-slate-200">
            <Toaster />
            <form onSubmit={handleSubmit} className="p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                        <span></span>
                        {error}
                    </div>
                )}

                {/* Name Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        placeholder="Kapil Raj KC"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Email Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-violet-600 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="kapilrajkc10@gmail.com"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Message Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        minLength={10}
                        rows="6"
                        placeholder="Tell me about your project..."
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors resize-none"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </form>
        </div>
    );
}
