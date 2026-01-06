import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BookOpen, Clock, Eye, Calendar, Tag, Search, X, Star } from 'lucide-react';
import Head from 'next/head';

export default function BlogPage() {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBlogs();
    }, [searchQuery, selectedTag, showFeaturedOnly, page]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedTag) params.append('tag', selectedTag);
            if (showFeaturedOnly) params.append('featured', 'true');
            params.append('page', page);
            params.append('limit', 12);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${params}`);
            const data = await response.json();

            if (data.success) {
                setBlogs(data.blogs);
                setTotalPages(data.totalPages);

                // Extract unique tags
                const tags = [...new Set(data.blogs.flatMap(blog => blog.tags))];
                setAllTags(tags);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBlogs();
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedTag('');
        setShowFeaturedOnly(false);
        setPage(1);
    };

    return (
        <>
            <Head>
                <title>Blog & Case Studies | Portfolio</title>
                <meta name="description" content="Technical blog posts and project case studies" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
                {/* Hero Section */}
                <section className="pt-32 pb-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full mb-6">
                            <BookOpen className="w-5 h-5" />
                            <span className="font-semibold">Blog & Case Studies</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 text-transparent bg-clip-text">
                                Technical Insights
                            </span>
                        </h1>
                        <p className="text-xl text-violet-600 max-w-2xl mx-auto font-medium">
                            Explore detailed case studies, technical deep dives, and learnings from real-world projects
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <section className="pb-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-gray-200/50">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
                                {/* Search */}
                                <div className="flex-1 relative group">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search blogs..."
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                    />
                                </div>

                                {/* Tag Filter */}
                                <select
                                    value={selectedTag}
                                    onChange={(e) => {
                                        setSelectedTag(e.target.value);
                                        setPage(1);
                                    }}
                                    className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white transition-all cursor-pointer hover:border-gray-300"
                                >
                                    <option value="">All Tags</option>
                                    {allTags.map((tag, index) => (
                                        <option key={index} value={tag}>{tag}</option>
                                    ))}
                                </select>

                                {/* Featured Toggle */}
                                <label className="flex items-center gap-3 px-5 py-3.5 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-violet-50 hover:border-violet-300 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={showFeaturedOnly}
                                        onChange={(e) => {
                                            setShowFeaturedOnly(e.target.checked);
                                            setPage(1);
                                        }}
                                        className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                                    />
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span className="font-medium text-gray-700 whitespace-nowrap">Featured</span>
                                </label>

                                <button
                                    type="submit"
                                    className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                                >
                                    Search
                                </button>
                            </form>

                            {/* Active Filters */}
                            {(searchQuery || selectedTag || showFeaturedOnly) && (
                                <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-gray-200">
                                    <span className="text-sm text-gray-600 font-semibold">Active Filters:</span>
                                    {searchQuery && (
                                        <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 rounded-xl text-sm font-medium shadow-sm">
                                            Search: "{searchQuery}"
                                            <button onClick={() => { setSearchQuery(''); setPage(1); }} className="hover:bg-white/50 rounded-full p-0.5 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedTag && (
                                        <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl text-sm font-medium shadow-sm">
                                            Tag: {selectedTag}
                                            <button onClick={() => { setSelectedTag(''); setPage(1); }} className="hover:bg-white/50 rounded-full p-0.5 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    {showFeaturedOnly && (
                                        <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 rounded-xl text-sm font-medium shadow-sm">
                                            Featured Only
                                            <button onClick={() => { setShowFeaturedOnly(false); setPage(1); }} className="hover:bg-white/50 rounded-full p-0.5 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gray-600 hover:text-gray-900 font-medium underline ml-2 hover:scale-105 transition-transform"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="pb-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                                <BookOpen className="w-16 h-16 text-violet-400 mx-auto mb-4" />
                                <p className="text-xl text-violet-600 font-semibold">No blog posts found</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {blogs.map((blog) => (
                                        <Link key={blog._id} href={`/blog/${blog.slug}`}>
                                            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col transform hover:-translate-y-2">
                                                {/* Cover Image */}
                                                <div className="relative h-56 overflow-hidden">
                                                    <img
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                                    {/* Featured Badge */}
                                                    {blog.featured && (
                                                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                                            <Star className="w-3.5 h-3.5 fill-current" />
                                                            Featured
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <h3 className="text-xl font-bold text-violet-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:bg-clip-text transition-all line-clamp-2">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-violet-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                                                        {blog.excerpt}
                                                    </p>

                                                    {/* Meta Info */}
                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {blog.readTime} min
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            {blog.views}
                                                        </span>
                                                        {blog.publishedAt && (
                                                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Tech Stack */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {blog.techStack.slice(0, 3).map((tech, index) => (
                                                            <span key={index} className="px-3 py-1 bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 text-xs font-medium rounded-lg border border-violet-100">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {blog.techStack.length > 3 && (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                                                                +{blog.techStack.length - 3}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Tags */}
                                                    {blog.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {blog.tags.slice(0, 2).map((tag, index) => (
                                                                <span key={index} className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg hover:bg-gray-100 transition-colors">
                                                                    <Tag className="w-3 h-3" />
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-3 mt-16">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setPage(i + 1)}
                                                    className={`w-11 h-11 rounded-xl font-semibold transition-all duration-200 ${page === i + 1
                                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg scale-110'
                                                        : 'border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-blob {
                    animation: blob 8s infinite ease-in-out;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </>
    );
}
