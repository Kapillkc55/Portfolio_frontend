import { useEffect, useState } from "react";
import { Code, Briefcase, Award, Target, Heart, Zap, Sparkles, Cpu, Database, Server, Globe, Cloud, Terminal, Layers } from "lucide-react";

export default function AboutUs() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [aboutData, setAboutData] = useState(null);

    // Fetch about content from API
    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about/`);
                const data = await response.json();

                if (data.success && data.about) {
                    setAboutData(data.about);
                }
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        };

        fetchAboutData();
    }, []);

    // Get technologies and expertise from API (backend auto-creates defaults if empty)
    const technologies = aboutData?.technologies?.filter(t => t.isActive).sort((a, b) => a.order - b.order) || [];
    const expertise = aboutData?.expertise?.sort((a, b) => a.order - b.order) || [];

    // Icon mapping for dynamic rendering
    const iconMap = {
        'Zap': <Zap className="w-6 h-6" />,
        'Layers': <Layers className="w-6 h-6" />,
        'Target': <Target className="w-6 h-6" />,
        'Heart': <Heart className="w-6 h-6" />,
        'Code': <Code className="w-6 h-6" />,
        'Briefcase': <Briefcase className="w-6 h-6" />,
        'Award': <Award className="w-6 h-6" />
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section id="about" className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Mouse Trailing Effect */}
            <div
                className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 pointer-events-none transition-transform duration-100"
                style={{
                    transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`,
                }}
            ></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Animation */}
                <div className="text-center mb-16 lg:mb-24">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-semibold text-violet-600">About Me</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-extrabold mb-6">
                        <span className="block bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
                            Crafting Digital
                        </span>
                        <span className="block bg-gradient-to-r from-fuchsia-600 via-violet-500 to-violet-600 bg-clip-text text-transparent">
                            Experiences
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Passionate Full Stack Developer creating beautiful, functional web applications
                        that deliver exceptional user experiences and measurable results.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
                    {/* Left Column - Image with 3D Effect */}
                    <div className="relative group">
                        <div className="relative z-10 transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2">
                            {/* Glowing Border Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                                <img
                                    src={aboutData?.profile?.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop"}
                                    alt={aboutData?.profile?.name || "Profile"}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop";
                                    }}
                                />

                                {/* Floating Badges */}
                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${aboutData?.profile?.status?.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <span className="font-bold text-slate-800">
                                            {aboutData?.profile?.status?.text || "Available for work"}
                                        </span>
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full shadow-lg">
                                    <span className="font-bold">{aboutData?.profile?.badge || "Full Stack Dev"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl rotate-12 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-fuchsia-500 to-rose-400 rounded-3xl -rotate-12 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </div>

                    {/* Right Column - Text Content */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Hi, I'm <span className="text-violet-600">{aboutData?.profile?.name || 'Kapil Raj KC'}</span>
                            </h3>
                            <div className="space-y-4">
                                {aboutData?.profile?.bio?.map((paragraph, index) => (
                                    <p key={index} className="text-lg text-slate-700 leading-relaxed">
                                        {paragraph}
                                    </p>
                                )) || (
                                        <>
                                            <p className="text-lg text-slate-700 leading-relaxed">
                                                A passionate <strong className="text-violet-600">Full Stack Developer</strong> from Kathmandu, Nepal,
                                                dedicated to building modern web applications that combine elegant design with powerful functionality.
                                            </p>
                                            <p className="text-lg text-slate-700 leading-relaxed">
                                                With expertise spanning the entire development stack, I create seamless user experiences
                                                and robust server-side solutions that scale effortlessly.
                                            </p>
                                            <p className="text-lg text-slate-700 leading-relaxed">
                                                My philosophy centers on writing clean, maintainable code and delivering projects that
                                                not only meet but exceed expectations through innovative solutions and attention to detail.
                                            </p>
                                        </>
                                    )}
                            </div>
                        </div>

                        {/* Expertise Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            {expertise.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="group p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-transparent transition-all duration-300 hover:shadow-xl cursor-pointer"
                                >
                                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${item.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <div className="text-white">
                                            {aboutData ? (iconMap[item.icon] || item.icon) : item.icon}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-600">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6">
                            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200">
                                <div className="text-3xl font-bold text-violet-600">
                                    {aboutData?.stats?.projects?.value || 50}{aboutData?.stats?.projects?.showPlus !== false && '+'}
                                </div>
                                <div className="text-sm text-slate-600">{aboutData?.stats?.projects?.label || 'Projects'}</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200">
                                <div className="text-3xl font-bold text-blue-600">
                                    {aboutData?.stats?.experience?.value || 3}{aboutData?.stats?.experience?.showPlus !== false && '+'}
                                </div>
                                <div className="text-sm text-slate-600">{aboutData?.stats?.experience?.label || 'Years Exp'}</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200">
                                <div className="text-3xl font-bold text-fuchsia-600">
                                    {aboutData?.stats?.satisfaction?.value || 100}{aboutData?.stats?.satisfaction?.showPlus === true && '+'}%
                                </div>
                                <div className="text-sm text-slate-600">{aboutData?.stats?.satisfaction?.label || 'Satisfaction'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technology Slider - 100% Full Width */}
            <div className="w-full mt-20 mb-16 px-0">
                <div className="text-center mb-12 px-4">
                    <h3 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
                        Technologies I Work With
                    </h3>
                    <p className="text-lg text-slate-600">
                        Mastering modern tools and frameworks to build exceptional solutions
                    </p>
                </div>

                {/* Slider Container - 100% Width */}
                <div className="relative overflow-hidden w-full">
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 via-slate-50/50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 via-slate-50/50 to-transparent z-10 pointer-events-none"></div>

                    {/* Sliding Track */}
                    <div className="flex gap-6 animate-tech-scroll py-8">
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <div
                                key={index}
                                className="group flex-shrink-0 flex flex-col items-center justify-center min-w-[140px] p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 hover:border-violet-500 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 cursor-pointer"
                            >
                                <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    {tech.iconUrl ? (
                                        <img
                                            src={tech.iconUrl}
                                            alt={tech.name}
                                            className="w-16 h-16 object-contain"
                                        />
                                    ) : (
                                        tech.icon
                                    )}
                                </div>
                                <div className="text-sm font-bold text-slate-800 text-center whitespace-nowrap">
                                    {tech.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add CSS for animations */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }

                @keyframes tech-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animate-tech-scroll {
                    animation: tech-scroll 30s linear infinite;
                }

                .animate-tech-scroll:hover {
                    animation-play-state: paused;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
}