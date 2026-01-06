import { Github, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const navigationLinks = [
        { name: "Home", href: "/#home" },
        { name: "About", href: "/#about" },
        { name: "Projects", href: "/#projects" },
        { name: "Contact", href: "/#contact" }
    ];

    const resourceLinks = [
        { name: "GitHub", href: "https://github.com/kapilraj10", icon: <Github className="w-4 h-4" /> },
    ];

    return (
        <footer className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-slate-900 py-12 border-t border-violet-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Logo/Name Section */}
                    <div>
                        <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 text-transparent bg-clip-text">Kapil Raj KC</h3>
                        <p className="text-violet-600 text-sm font-medium">Full Stack Developer & Creative Problem Solver</p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-4">Navigation</h4>
                        <div className="flex flex-wrap justify-center gap-6">
                            {navigationLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="text-violet-700 hover:text-fuchsia-600 transition-colors duration-300 font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-4">Resources</h4>
                        <div className="flex flex-wrap justify-center gap-6">
                            {resourceLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="flex items-center gap-2 text-violet-700 hover:text-fuchsia-600 transition-colors duration-300 font-medium"
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t border-violet-200"></div>

                    {/* Copyright */}
                    <div className="text-violet-600 text-sm font-medium">
                        © 2026 Kapil Raj KC. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
