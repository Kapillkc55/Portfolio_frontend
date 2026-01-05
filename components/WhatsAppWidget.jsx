import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

export default function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const phoneNumber = '9779704167805'; // Your WhatsApp number

    // Listen for custom event from navbar
    useEffect(() => {
        const handleOpenWhatsApp = () => {
            setIsOpen(true);
        };

        window.addEventListener('openWhatsApp', handleOpenWhatsApp);

        return () => {
            window.removeEventListener('openWhatsApp', handleOpenWhatsApp);
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
            setMessage('');
            setIsOpen(false);
        }
    };

    const quickMessages = [
        "Hi, I'd like to discuss a project",
        "Can we schedule a call?",
        "I need web development services",
        "Tell me about your services"
    ];

    return (
        <>
            {/* WhatsApp Popup Chat */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <span className="text-2xl">👨‍💻</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Kapil Raj KC</h3>
                                <p className="text-green-100 text-xs">Typically replies instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-green-600 rounded-full p-1 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="p-4 bg-gray-50 max-h-96 overflow-y-auto">
                        {/* Welcome Message */}
                        <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm mb-4">
                            <p className="text-sm text-gray-800">
                                👋 Hi there! How can I help you today?
                            </p>
                        </div>

                        {/* Quick Reply Buttons */}
                        <div className="space-y-2 mb-4">
                            {quickMessages.map((msg, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMessage(msg)}
                                    className="w-full text-left px-4 py-2 bg-white hover:bg-green-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-green-300 transition-all"
                                >
                                    {msg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-full p-2 transition-all disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Powered by WhatsApp
                        </p>
                    </div>
                </div>
            )}

            {/* Floating WhatsApp Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110 animate-bounce"
                aria-label="Open WhatsApp Chat"
            >
                {isOpen ? (
                    <X className="w-8 h-8" />
                ) : (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                )}
            </button>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
            `}</style>
        </>
    );
}
