import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Name */}
                    <div className="flex items-center">
                        <a href="#home" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-white">K</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
                                Kapil
                            </span>
                        </a>
                    </div>

                    {/* Desktop Navigation and Button */}
                    <div className="hidden md:flex items-center gap-12">
                        <div className="flex items-center space-x-8">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="text-slate-600 hover:text-purple-600 font-medium transition-colors duration-300 relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            ))}
                        </div>

                        {/* Talk with Kapil Button */}
                        <button
                            onClick={() => {
                                // Trigger WhatsApp widget
                                window.dispatchEvent(new CustomEvent('openWhatsApp'));
                            }}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                        >
                            Talk with Kapil
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-purple-600 transition-colors duration-300"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-200">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-300"
                            >
                                {link.name}
                            </a>
                        ))}

                        {/* Talk with Kapil Button - Mobile */}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                // Trigger WhatsApp widget
                                window.dispatchEvent(new CustomEvent('openWhatsApp'));
                            }}
                            className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-center hover:shadow-lg transition-all duration-300"
                        >
                            Talk with Kapil
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
