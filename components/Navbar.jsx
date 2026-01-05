import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'About', href: '/#about' },
        { name: 'Experience', href: '/#experience' },
        { name: 'Projects', href: '/#projects' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/#contact' }
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Name */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
                                Kapil
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <div className="flex items-center space-x-8">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="text-slate-600 hover:text-purple-600 font-medium transition-colors duration-300 relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}
                        </div>
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
                            <Link
                                key={index}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
