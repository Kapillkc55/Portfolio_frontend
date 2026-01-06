import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye, Calendar, Tag, Github, ExternalLink, User, Lightbulb, AlertTriangle, Code, Layout, Wrench } from 'lucide-react';
import Head from 'next/head';

export default function BlogDetailPage() {
    const router = useRouter();
    const { slug } = router.query;
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    const fetchBlog = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`);
            const data = await response.json();

            if (data.success) {
                setBlog(data.blog);
            } else {
                router.push('/blog');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            router.push('/blog');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{blog.title} | Blog</title>
                <meta name="description" content={blog.excerpt} />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
                {/* Hero Section with Cover Image */}
                <section className="pt-24 relative">
                    <div className="relative h-[60vh] overflow-hidden">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>

                        {/* Hero Content */}
                        <div className="absolute inset-0 flex items-end">
                            <div className="max-w-5xl mx-auto px-4 pb-12 w-full">
                                <Link href="/blog">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all mb-6">
                                        <ArrowLeft className="w-5 h-5" />
                                        Back to Blog
                                    </button>
                                </Link>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                    {blog.title}
                                </h1>

                                <p className="text-xl text-gray-200 mb-6 max-w-3xl">
                                    {blog.excerpt}
                                </p>

                                {/* Meta Info */}
                                <div className="flex flex-wrap gap-6 text-white/90">
                                    {blog.author && (
                                        <span className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            {blog.author.name}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        {blog.readTime} min read
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        {blog.views} views
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Tech Stack */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Tech Stack</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {blog.techStack.map((tech, index) => (
                                    <span key={index} className="px-4 py-2 bg-violet-100 text-violet-700 font-medium rounded-lg">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Problem Statement */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Problem Statement</h2>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {blog.problemStatement}
                            </p>
                        </div>

                        {/* Architecture */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                    <Layout className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Architecture Overview</h2>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {blog.architecture}
                            </p>
                        </div>

                        {/* Implementation */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                    <Wrench className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Implementation Details</h2>
                            </div>
                            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {blog.implementation}
                            </div>
                        </div>

                        {/* Challenges & Solutions */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Challenges & Solutions</h2>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {blog.challenges}
                            </p>
                        </div>

                        {/* Key Learnings */}
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold">Key Learnings</h2>
                            </div>
                            <p className="text-white/95 text-lg leading-relaxed whitespace-pre-line">
                                {blog.learnings}
                            </p>
                        </div>

                        {/* Links */}
                        {(blog.githubUrl || blog.liveUrl) && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Links</h2>
                                <div className="flex flex-wrap gap-4">
                                    {blog.githubUrl && (
                                        <a
                                            href={blog.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                                        >
                                            <Github className="w-5 h-5" />
                                            View on GitHub
                                        </a>
                                    )}
                                    {blog.liveUrl && (
                                        <a
                                            href={blog.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg transition-all"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Related Project */}
                        {blog.project && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Project</h2>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={blog.project.image}
                                        alt={blog.project.title}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{blog.project.title}</h3>
                                        <div className="flex gap-3 mt-2">
                                            {blog.project.githubUrl && (
                                                <a
                                                    href={blog.project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                            {blog.project.liveUrl && (
                                                <a
                                                    href={blog.project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {blog.tags.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
                                <div className="flex flex-wrap gap-3">
                                    {blog.tags.map((tag, index) => (
                                        <Link key={index} href={`/blog?tag=${tag}`}>
                                            <span className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                                                <Tag className="w-4 h-4" />
                                                {tag}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back to Blog Button */}
                        <div className="text-center">
                            <Link href="/blog">
                                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg transition-all mx-auto">
                                    <ArrowLeft className="w-5 h-5" />
                                    Back to All Posts
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
