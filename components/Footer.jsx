import { Github, FileText, BookOpen, Code } from "lucide-react";

export default function Footer() {
    const navigationLinks = [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Contact", href: "#contact" }
    ];

    const resourceLinks = [
        { name: "Resume", href: "#", icon: <FileText className="w-4 h-4" /> },
        { name: "GitHub", href: "https://github.com/kapilrajkc", icon: <Github className="w-4 h-4" /> },
        { name: "Blog", href: "#", icon: <BookOpen className="w-4 h-4" /> },
        { name: "Dev Tools", href: "#", icon: <Code className="w-4 h-4" /> }
    ];

    return (
        <footer className="bg-white text-slate-900 py-12 border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Logo/Name Section */}
                    <div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <span className="text-2xl font-bold text-white">K</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1 text-slate-900">Kapil Raj KC</h3>
                        <p className="text-slate-600 text-sm">Full Stack Developer & Creative Problem Solver</p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Navigation</h4>
                        <div className="flex flex-wrap justify-center gap-6">
                            {navigationLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="text-slate-600 hover:text-purple-600 transition-colors duration-300 font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Resources</h4>
                        <div className="flex flex-wrap justify-center gap-6">
                            {resourceLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors duration-300 font-medium"
                                >
                                    {link.icon}
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t border-slate-200"></div>

                    {/* Copyright */}
                    <div className="text-slate-500 text-sm">
                        © 2026 Kapil Raj KC. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
