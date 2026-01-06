import { Github, ExternalLink, Code2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Work() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
                const data = await response.json();

                if (data.success) {
                    setProjects(data.projects);
                    console.log('Projects fetched:', data.projects); // Debug log
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section id="projects" className="min-h-screen py-20 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Code2 className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="min-h-screen py-20 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                        My Work & Projects
                    </h2>
                    <p className="text-xl lg:text-2xl text-slate-600 font-medium max-w-3xl mx-auto">
                        Crafting digital experiences with cutting-edge technologies
                    </p>
                </div>

                {/* Projects List - Alternating Layout */}
                <div className="space-y-24 lg:space-y-32">
                    {projects.length === 0 ? (
                        <div className="text-center py-20">
                            <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-xl text-gray-600">No projects available yet. Check back soon!</p>
                        </div>
                    ) : (
                        projects.map((project, index) => (
                            <div
                                key={project._id || index}
                                className={`group relative flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    } gap-8 lg:gap-12 items-center`}
                            >
                                {/* Image Side */}
                                <div className="w-full lg:w-1/2 relative">
                                    <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-violet-500/30 group-hover:-translate-y-2">
                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 mix-blend-multiply z-10`}></div>

                                        {/* Project Image */}
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Action Buttons */}
                                        <div className="absolute top-6 right-6 z-20 flex gap-2">
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-violet-500 text-slate-700 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                                                >
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-violet-500 text-slate-700 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className={`absolute -z-10 ${index % 2 === 0 ? '-right-8' : '-left-8'} -bottom-8 w-72 h-72 bg-gradient-to-br ${project.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                                </div>

                                {/* Content Side */}
                                <div className="w-full lg:w-1/2 space-y-6">
                                    {/* Project Number */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                                        <span className="text-sm font-bold text-violet-600">Project {String(index + 1).padStart(2, '0')}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors duration-300">
                                        {project.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-lg lg:text-xl text-slate-600 leading-relaxed">
                                        {project.fullDescription}
                                    </p>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-3">
                                        {project.technologies.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="px-4 py-2 text-sm lg:text-base font-semibold rounded-xl bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-500 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 shadow-sm"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>


            </div>
        </section>
    );
}
