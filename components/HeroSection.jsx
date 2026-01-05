import { useState, useEffect } from "react";
import { ChevronDown, Linkedin, Instagram, Facebook, Twitter, Github, Calendar, Send, Mail, User, MessageSquare, Loader2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function HeroSection() {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        completedProjects: 15,
        ongoingProjects: 3,
        happyClients: 20,
        yearsExperience: 0
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        meetingTime: '',
        meetingType: 'online'
    });

    // Fetch project statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/project-stats/');
                const data = await response.json();

                if (data.success && data.stats) {
                    setStats({
                        completedProjects: data.stats.completedProjects,
                        ongoingProjects: data.stats.ongoingProjects,
                        happyClients: data.stats.happyClients,
                        yearsExperience: data.stats.yearsExperience
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                // Keep default values if fetch fails
            }
        };

        fetchStats();
    }, []);

    const socialLinks = [
        { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/kapilrajkc", color: "#0077B5" },
        { name: "GitHub", icon: Github, url: "https://github.com/kapilrajkc", color: "#333333" },
        { name: "Instagram", icon: Instagram, url: "https://instagram.com/kapilrajkc", color: "#E4405F" },
        { name: "Facebook", icon: Facebook, url: "https://facebook.com/kapilrajkc", color: "#1877F2" },
        { name: "Twitter", icon: Twitter, url: "https://twitter.com/kapilrajkc", color: "#1DA1F2" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/contacts/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Message sent successfully! Check your email for confirmation.', {
                    duration: 5000,
                    position: 'top-center',
                });
                setFormData({ name: '', email: '', message: '', meetingTime: '', meetingType: 'online' });
                // Auto close form after successful submission
                setTimeout(() => {
                    setShowForm(false);
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to send message. Please try again.', {
                    duration: 4000,
                    position: 'top-center',
                });
            }
        } catch (err) {
            toast.error(' Network error. Please check your connection and try again.', {
                duration: 4000,
                position: 'top-center',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="home" className="hero-section">
            <Toaster />
            <div className="hero-bg-decor" />
            <div className="hero-grid-pattern" />

            <div className="hero-content">
                <div className="hero-flex">
                    {/* Left Side - Hero Text */}
                    <div className="hero-text">
                        <div className="hero-status">
                            <div className="pulse-dot" />
                            Available for new projects
                        </div>

                        <h1 className="hero-title">
                            Hi, I'm <span className="highlight">Kapil Raj KC</span>
                        </h1>
                        <h2 className="hero-subtitle">Full Stack Developer & UI/UX Enthusiast</h2>

                        <p className="hero-description">
                            I'm a passionate developer from Kathmandu, Nepal, specializing in building modern web applications.
                            Expert in Frontend Development, Backend Architecture, and Admin Panel Design
                            using cutting-edge technologies like React, Node.js, and MongoDB.
                        </p>

                        {/* Project Stats */}
                        <div className="project-stats">
                            <div className="stat-card">
                                <div className="stat-number">{stats.completedProjects}+</div>
                                <div className="stat-label">Completed Projects</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">{stats.ongoingProjects}</div>
                                <div className="stat-label">Years Experience</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">{stats.happyClients}+</div>
                                <div className="stat-label">Happy Clients</div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="social-links">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                        style={{ '--hover-color': social.color }}
                                        aria-label={social.name}
                                    >
                                        <Icon className="social-icon" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side - Meeting Card or Contact Form */}
                    {!showForm ? (
                        <div className="meeting-card">
                            <div className="meeting-icon-wrapper">
                                <Calendar className="meeting-icon-large" />
                            </div>
                            <h3 className="meeting-title">Schedule a Meeting</h3>
                            <p className="meeting-description">
                                Book a convenient time to discuss your project. Available for both online meetings and in-person consultations in Kathmandu.
                            </p>

                            <button
                                onClick={() => setShowForm(true)}
                                className="meeting-btn"
                            >
                                <Calendar className="meeting-btn-icon" />
                                Book a Meeting
                            </button>
                        </div>
                    ) : (
                        <div className="contact-form-section">
                            <button
                                onClick={() => setShowForm(false)}
                                className="close-form-btn"
                                aria-label="Close form"
                            >
                                ×
                            </button>
                            <div className="form-header">
                                <h3 className="form-title">Let's Connect</h3>
                                <p className="form-subtitle">Schedule a meeting or drop a message</p>
                            </div>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label className="form-label">
                                        <User className="label-icon" />
                                        Your Name <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Mail className="label-icon" />
                                        Email Address <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Calendar className="label-icon" />
                                        Preferred Meeting Date & Time <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="meetingTime"
                                        value={formData.meetingTime}
                                        onChange={handleChange}
                                        className="form-input"
                                        min={new Date().toISOString().slice(0, 16)}
                                        required
                                    />

                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Meeting Type <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="meetingType"
                                                value="online"
                                                checked={formData.meetingType === 'online'}
                                                onChange={handleChange}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span> Online (Zoom/Meet)</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="meetingType"
                                                value="in-person"
                                                checked={formData.meetingType === 'in-person'}
                                                onChange={handleChange}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span> In-Person (Kathmandu)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <MessageSquare className="label-icon" />
                                        Your Message <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell me about your project..."
                                        className="form-textarea"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="form-submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="submit-icon animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="submit-icon" />
                                            Book a Meeting
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-dot" />
                </div>
                <ChevronDown className="chevron-icon" />
                <span className="scroll-text">Scroll Down</span>
            </div>
        </section>
    );
}
