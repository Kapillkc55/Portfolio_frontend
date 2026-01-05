import { useState, useEffect } from 'react';
import ContactForm from './ContactForm';
import { Mail, MapPin, Send, Loader2 } from "lucide-react";

export default function Contact() {
    const [contactInfo, setContactInfo] = useState({
        email: 'kapilmern.dev@gmail.com',
        phone: '+977 9704167805',
        location: 'Kathmandu, Nepal'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/contact-info');
            const data = await response.json();

            if (data.success) {
                setContactInfo({
                    email: data.contactInfo.email,
                    phone: data.contactInfo.phone,
                    location: data.contactInfo.location
                });
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
            // Keep default values if fetch fails
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="relative min-h-screen py-20 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-10 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                        <Send className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-semibold text-violet-600">Get In Touch</span>
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
                        Contact Me
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Feel free to reach out with any questions, feedback, or opportunities. I'll get back to you as soon as possible.
                    </p>
                </div>

                {/* Contact Content */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Contact Information - Left Side */}
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-slate-200 h-full">
                            <h3 className="text-3xl font-bold text-slate-900 mb-8">Let's build something great.</h3>

                            {/* Contact Details */}
                            <div className="space-y-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Email */}
                                        <div className="group">
                                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <Mail className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-violet-600 mb-1">Email</p>
                                                    <a
                                                        href={`mailto:${contactInfo.email}`}
                                                        className="text-slate-900 font-medium hover:text-violet-600 transition-colors duration-300"
                                                    >
                                                        {contactInfo.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="group">
                                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <MapPin className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-green-600 mb-1">Location</p>
                                                    <p className="text-slate-900 font-medium">
                                                        {contactInfo.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Right Side */}
                    <div className="lg:sticky lg:top-8">
                        <ContactForm />
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
