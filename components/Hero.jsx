import React from "react";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-[#060c23] overflow-hidden">

            {/* Grid Background */}
            <div className="absolute inset-0 
        bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),
        linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
        bg-[size:48px_48px]"
            />

            {/* Glow Effect */}
            <div className="absolute w-[420px] h-[420px] bg-purple-500/20 rounded-full blur-3xl" />

            {/* Main Content */}
            <div className="relative z-10 text-center px-4">
                <h1 className="text-5xl md:text-6xl font-bold 
          bg-gradient-to-r from-sky-400 to-purple-500 
          bg-clip-text text-transparent">
                    Sarah Parker
                </h1>

                <p className="mt-4 text-gray-300 text-lg">
                    Frontend Developer & UI/UX Enthusiast
                </p>

                {/* Skills */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {["React", "Next.js", "TypeScript", "Tailwind CSS"].map(skill => (
                        <span
                            key={skill}
                            className="px-4 py-1.5 text-sm text-white
              rounded-full border border-white/20
              bg-white/5 backdrop-blur-md
              hover:bg-white/10 transition"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
