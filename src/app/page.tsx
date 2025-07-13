'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Command, Lightbulb } from 'lucide-react';

// Particle imports
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { particlesConfig } from './particlesconfig';

// Import our new navbar
import AnimatedNavbar from '../components/ui/AnimatedNavbar';

// Custom Hook for the "decryption" scramble effect
const useScrambleText = (eventualText: string) => {
    const [text, setText] = useState('');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    useEffect(() => {
        let frameRequest: number;
        let frame = 0;
        const queue: { from: string; to: string; start: number; end: number }[] = [];
        for (let i = 0; i < eventualText.length; i++) {
            const from = chars[Math.floor(Math.random() * chars.length)];
            const to = eventualText[i];
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            queue.push({ from, to, start, end });
        }
        const update = () => {
            let output = '';
            for (let i = 0; i < queue.length; i++) {
                const { from, to, start, end } = queue[i];
                if (frame >= end) {
                    output += to;
                } else if (frame >= start) {
                    output += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    output += from;
                }
            }
            setText(output);
            if (output !== eventualText) {
                frame++;
                frameRequest = requestAnimationFrame(update);
            }
        };
        update();
        return () => cancelAnimationFrame(frameRequest);
    }, [eventualText]);
    return text;
};

// Typing animation hook
const useTypingAnimation = (texts: string[], speed = 100) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const current = texts[currentIndex];

            if (isPaused) {
                setIsPaused(false);
                setIsDeleting(true);
                return;
            }

            if (isDeleting) {
                setCurrentText(current.substring(0, currentText.length - 1));
                
                if (currentText === '') {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            } else {
                setCurrentText(current.substring(0, currentText.length + 1));
                
                if (currentText === current) {
                    setIsPaused(true);
                }
            }
        }, isDeleting ? speed / 2 : isPaused ? 2000 : speed);

        return () => clearTimeout(timeout);
    }, [currentText, currentIndex, isDeleting, isPaused, texts, speed]);

    return currentText;
};

// A new component for our custom loader animation
const ForgingLoader = () => (
    <div className="flex items-center justify-center space-x-1 h-full">
        <span className="w-1 h-4 bg-fuchsia-500 rounded-full animate-beat" style={{ animationDelay: '0s' }} />
        <span className="w-1 h-4 bg-fuchsia-500 rounded-full animate-beat" style={{ animationDelay: '0.2s' }} />
        <span className="w-1 h-4 bg-fuchsia-500 rounded-full animate-beat" style={{ animationDelay: '0.4s' }} />
    </div>
);

// Example suggestions component
const Suggestions = ({ onSuggestionClick, isVisible }: { onSuggestionClick: (suggestion: string) => void, isVisible: boolean }) => {
    const suggestions = [
        "TechFlow AI",
        "DataForge Labs", 
        "CloudNinja Solutions",
        "PixelCraft Studios",
        "NeuralLink Systems",
        "QuantumLeap Inc"
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl z-10"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-fuchsia-400" />
                        <span className="text-sm text-slate-400 font-medium">Try these examples:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {suggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => onSuggestionClick(suggestion)}
                                className="text-left text-sm text-slate-300 hover:text-fuchsia-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
                            >
                                {suggestion}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function HomePage() {
    const [company, setCompany] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const headline = useScrambleText("Forge Connections");
    const [isParticlesLoaded, setIsParticlesLoaded] = useState(false);

    // Typing animation for placeholder
    const placeholderTexts = [
        "Enter your startup name...",
        "TechFlow AI",
        "DataForge Labs", 
        "CloudNinja Solutions",
        "PixelCraft Studios"
    ];
    const typingText = useTypingAnimation(placeholderTexts, 80);

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
        setIsParticlesLoaded(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!company.trim() || isLoading) return;

        setIsLoading(true);
        setShowSuggestions(false);
        setTimeout(() => {
            router.push(`/founder?company=${encodeURIComponent(company)}`);
        }, 2500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setCompany(suggestion);
        setShowSuggestions(false);
    };

    const handleInputFocus = () => {
        if (!company && !isLoading) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // Delay to allow suggestion clicks to register
        setTimeout(() => setShowSuggestions(false), 150);
    };

    return (
        <div className="min-h-screen w-full bg-black text-slate-100 relative font-sans overflow-hidden">
            {/* Add font styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
                
                .font-heading {
                    font-family: 'Space Grotesk', system-ui, sans-serif;
                    font-weight: 700;
                    letter-spacing: -0.05em;
                }
                
                .font-body {
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #fff 0%, #e2e8f0 50%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .typing-cursor::after {
                    content: '|';
                    animation: blink 1s infinite;
                    color: #a855f7;
                }

                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `}</style>

            <AnimatedNavbar />
            
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particlesConfig}
                className="absolute inset-0 z-0"
            />
            
            <div className="absolute inset-0 z-10 bg-black/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <motion.div 
                className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isParticlesLoaded ? 1 : 0 }}
                transition={{ duration: 1.5 }}
            >
                <div className="text-center space-y-12 max-w-8xl mx-auto">
                    
                    <motion.h1 
                        className="text-4xl md:text-8xl font-heading gradient-text whitespace-nowrap"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {headline}
                    </motion.h1>
                    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="space-y-6"
                    >
                        <p className="text-2xl md:text-3xl text-slate-300 max-w-3xl mx-auto font-body font-light leading-relaxed">
                            Your idea is the <span className="text-fuchsia-400 font-medium">ore</span>. 
                            Our AI is the <span className="text-cyan-400 font-medium">fire</span>.
                        </p>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-body">
                            Craft cold emails that don't just reach inboxes—they forge lasting connections.
                        </p>
                    </motion.div>
                    
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="space-y-8"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        <div className="relative w-full max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    placeholder=""
                                    disabled={isLoading}
                                    className={`
                                        relative w-full h-20 bg-black/80 backdrop-blur-xl rounded-2xl border-2 border-slate-700 
                                        focus:border-fuchsia-500 transition-all duration-500 text-center text-xl font-body font-medium
                                        placeholder-slate-500 focus:outline-none text-white shadow-2xl
                                        ${isLoading ? 'pr-20' : 'pr-6'}
                                    `}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(15,23,42,0.8) 100%)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                    }}
                                />
                                
                                {/* Custom animated placeholder */}
                                {!company && !isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-slate-400 text-xl font-body typing-cursor">
                                            {typingText}
                                        </span>
                                    </div>
                                )}
                                
                                {isLoading && (
                                    <div className="absolute top-0 right-0 h-full w-20 flex items-center justify-center">
                                        <ForgingLoader />
                                    </div>
                                )}
                            </div>
                            
                            <Suggestions 
                                onSuggestionClick={handleSuggestionClick} 
                                isVisible={showSuggestions}
                            />
                        </div>
                        
                        <motion.button 
                            type="submit" 
                            className="group mx-auto flex items-center gap-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 text-white font-body font-semibold py-5 px-10 rounded-2xl shadow-2xl shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            whileHover={!isLoading ? { 
                                scale: 1.05, 
                                boxShadow: "0px 20px 40px rgba(244, 63, 255, 0.5)",
                                background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #06b6d4 100%)"
                            } : {}}
                            whileTap={!isLoading ? { scale: 0.95 } : {}}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            disabled={isLoading}
                            style={{
                                background: 'linear-gradient(135deg, #c026d3 0%, #7c3aed 50%, #0891b2 100%)',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5">
                                        <ForgingLoader />
                                    </div>
                                    Forging Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                                    Start Forging
                                    <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                                </>
                            )}
                        </motion.button>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
}
