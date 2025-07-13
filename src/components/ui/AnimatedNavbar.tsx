// src/components/AnimatedNavbar.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home, BarChart2, Github, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const mainNavLinks = [
  { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
  { name: 'Analytics', href: '#', icon: <BarChart2 className="w-4 h-4" /> },
  { name: 'GitHub', href: 'https://github.com', icon: <Github className="w-4 h-4" /> },
];


const AnimatedNavbar = () => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Animation variants for the main navbar expansion
    const navbarVariants = {
        collapsed: { 
            width: '400px',
            transition: { 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1],
            }
        },
        expanded: { 
            width: '700px',
            transition: { 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1],
            }
        },
    };

    // Animation variants for the dropdown panel
    const dropdownVariants = {
        hidden: { 
            opacity: 0, 
            y: -20, 
            scale: 0.95,
            transition: { 
                duration: 0.3, 
                ease: [0.25, 0.1, 0.25, 1] 
            }
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1], 
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        },
    };

    // Staggered animation for items inside the dropdown
    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: -10,
            x: -5
        },
        visible: { 
            opacity: 1, 
            y: 0,
            x: 0,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
    };

    // Logo animation variants
    const logoVariants = {
        collapsed: { scale: 1 },
        expanded: { 
            scale: 1.05,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Main navbar with horizontal expansion */}
            <motion.div
                variants={navbarVariants}
                animate={isHovered ? "expanded" : "collapsed"}
                className="relative flex items-center justify-between h-16 bg-gradient-to-r from-black/80 via-slate-900/80 to-black/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl px-6 shadow-2xl shadow-black/50"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(15,23,42,0.9) 50%, rgba(0,0,0,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
            >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Logo section with animation */}
                <motion.div variants={logoVariants} animate={isHovered ? "expanded" : "collapsed"}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <motion.div
                                animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                <Sparkles className="text-fuchsia-500 w-6 h-6 drop-shadow-lg" />
                            </motion.div>
                            <div className="absolute inset-0 text-fuchsia-500 w-6 h-6 blur-sm opacity-50">
                                <Sparkles className="w-6 h-6" />
                            </div>
                        </div>
                        <span className="text-white font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text">
                            Forge AI
                        </span>
                    </Link>
                </motion.div>

                {/* Navigation links */}
                <div className="flex items-center gap-2">
                    {mainNavLinks.map((item, index) => (
                        <Link key={item.name} href={item.href} legacyBehavior>
                            <motion.a 
                                className="group relative text-slate-300 hover:text-white transition-all duration-300 p-3 rounded-xl hover:bg-white/5"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="relative z-10">
                                    {item.icon}
                                </div>
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    layoutId={`nav-${item.name}`}
                                />
                            </motion.a>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Expanded dropdown panel */}

        </motion.div>
    );
};

export default AnimatedNavbar;
