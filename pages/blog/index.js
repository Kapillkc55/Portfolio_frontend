import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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

            const response = await fetch(`http://localhost:5000/api/blogs?${params}`);
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

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
                <Navbar />

                {/* Hero Section */}
                <section className="pt-32 pb-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
                            <BookOpen className="w-5 h-5" />
                            <span className="font-semibold">Blog & Case Studies</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                                Technical Insights
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore detailed case studies, technical deep dives, and learnings from real-world projects
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <section className="pb-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search blogs..."
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Tag Filter */}
                                <select
                                    value={selectedTag}
                                    onChange={(e) => {
                                        setSelectedTag(e.target.value);
                                        setPage(1);
                                    }}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">All Tags</option>
                                    {allTags.map((tag, index) => (
                                        <option key={index} value={tag}>{tag}</option>
                                    ))}
                                </select>

                                {/* Featured Toggle */}
                                <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={showFeaturedOnly}
                                        onChange={(e) => {
                                            setShowFeaturedOnly(e.target.checked);
                                            setPage(1);
                                        }}
                                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span className="font-medium text-gray-700 whitespace-nowrap">Featured Only</span>
                                </label>

                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Search
                                </button>
                            </form>

                            {/* Active Filters */}
                            {(searchQuery || selectedTag || showFeaturedOnly) && (
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
                                    {searchQuery && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                            Search: "{searchQuery}"
                                            <button onClick={() => { setSearchQuery(''); setPage(1); }}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedTag && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                            Tag: {selectedTag}
                                            <button onClick={() => { setSelectedTag(''); setPage(1); }}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    {showFeaturedOnly && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                            Featured Only
                                            <button onClick={() => { setShowFeaturedOnly(false); setPage(1); }}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
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
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl text-gray-600">No blog posts found</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {blogs.map((blog) => (
                                        <Link key={blog._id} href={`/blog/${blog.slug}`}>
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                                                {/* Cover Image */}
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                                    {/* Featured Badge */}
                                                    {blog.featured && (
                                                        <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            Featured
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                                        {blog.excerpt}
                                                    </p>

                                                    {/* Meta Info */}
                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {blog.readTime} min
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {blog.views} views
                                                        </span>
                                                        {blog.publishedAt && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Tech Stack */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {blog.techStack.slice(0, 3).map((tech, index) => (
                                                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {blog.techStack.length > 3 && (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                                +{blog.techStack.length - 3}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Tags */}
                                                    {blog.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {blog.tags.slice(0, 2).map((tag, index) => (
                                                                <span key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
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
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setPage(i + 1)}
                                                    className={`w-10 h-10 rounded-lg font-medium ${page === i + 1
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                            : 'border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
