import { Briefcase, Calendar, MapPin, Award, TrendingUp, Code, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Experience() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experiences`);
                const data = await response.json();

                if (data.success) {
                    setExperiences(data.experiences);
                }
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (loading) {
        return (
            <section id="experience" className="relative min-h-screen py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Briefcase className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading experiences...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="experience" className="relative min-h-screen py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                        <Briefcase className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-semibold text-violet-600">Career Journey</span>
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
                        <span className="block bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
                            Experience &
                        </span>
                        <span className="block bg-gradient-to-r from-fuchsia-600 via-violet-500 to-violet-600 bg-clip-text text-transparent">
                            Internships
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        My professional journey through innovative companies and exciting projects
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-blue-500 transform -translate-x-1/2"></div>

                    {/* Experience Items */}
                    <div className="space-y-12 lg:space-y-20">
                        {experiences.map((exp, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                            >
                                {/* Timeline Node (Center) */}
                                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${exp.gradient} flex items-center justify-center shadow-2xl z-10 border-4 border-white`}>
                                        <span className="text-2xl">{exp.icon}</span>
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className={`w-full lg:w-[calc(50%-3rem)] ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                    <div className="group relative bg-white rounded-2xl lg:rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-violet-500 hover:-translate-y-2">
                                        {/* Gradient Background on Hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} opacity-0 group-hover:opacity-5 rounded-2xl lg:rounded-3xl transition-opacity duration-500`}></div>

                                        <div className="relative z-10">
                                            {/* Mobile Icon */}
                                            <div className="lg:hidden flex items-center gap-4 mb-4">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${exp.gradient} flex items-center justify-center shadow-lg`}>
                                                    <span className="text-2xl">{exp.icon}</span>
                                                </div>
                                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${exp.type === 'Internship'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-violet-100 text-violet-700'
                                                    }`}>
                                                    {exp.type}
                                                </span>
                                            </div>

                                            {/* Type Badge (Desktop) */}
                                            <div className={`hidden lg:inline-block mb-4 px-4 py-1.5 text-xs font-bold rounded-full ${exp.type === 'Internship'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-violet-100 text-violet-700'
                                                }`}>
                                                {exp.type}
                                            </div>

                                            {/* Role & Company */}
                                            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                                                {exp.role}
                                            </h3>
                                            <p className="text-xl font-semibold text-slate-700 mb-4">{exp.company}</p>

                                            {/* Meta Info */}
                                            <div className={`flex flex-wrap gap-4 mb-6 text-sm text-slate-600 ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-violet-500" />
                                                    <span>{exp.period}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <TrendingUp className="w-4 h-4 text-violet-500" />
                                                    <span>{exp.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-violet-500" />
                                                    <span>{exp.location}</span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-slate-600 leading-relaxed mb-6">
                                                {exp.description}
                                            </p>

                                            {/* Achievements */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Award className="w-5 h-5 text-violet-500" />
                                                    <h4 className="font-bold text-slate-800">Key Achievements</h4>
                                                </div>
                                                <ul className={`space-y-2 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                                    {exp.achievements.map((achievement, achIndex) => (
                                                        <li key={achIndex} className="flex items-start gap-2">
                                                            <Sparkles className={`w-4 h-4 text-violet-500 flex-shrink-0 mt-1 ${index % 2 === 0 ? 'lg:order-2' : ''}`} />
                                                            <span className="text-slate-600 text-sm">{achievement}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Technologies */}
                                            <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                                                {exp.technologies.map((tech, techIndex) => (
                                                    <span
                                                        key={techIndex}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:border-violet-500 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Spacer for other side */}
                                <div className="hidden lg:block w-[calc(50%-3rem)]"></div>
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
                
                .animate-blob {
                    animation: blob 7s infinite;
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
