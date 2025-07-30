'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
    User, MessageSquare, BrainCircuit, Copy, Wand2, Send, TrendingUp, 
    Settings, Sparkles, CheckCircle, Search, ArrowLeft, MapPin,
    Building, ExternalLink, UserCheck, Edit, BarChart3, Target,
    Clock, Mail, Zap, Brain, Globe, Star, Award, Briefcase,
    Calendar, Eye, MousePointer, Users, ChevronRight, Plus,
    Filter, Download, RefreshCw, Heart, Share2, Bookmark
} from 'lucide-react';
import { useRouter } from 'next/navigation'

import { supabase } from '../lib/supabaseclient'

import {  X, Lock, EyeOff } from 'lucide-react';
export const HomeLoadingScreen = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Static positions to avoid hydration mismatch
    const floatingDots = [
        { left: 20, top: 30 },
        { left: 80, top: 70 },
        { left: 60, top: 20 },
        { left: 15, top: 80 },
        { left: 90, top: 40 },
        { left: 50, top: 60 }
    ];

    if (!mounted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/3 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Main loading content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Logo */}
                <motion.div
                    className="relative mb-8"
                    animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, -1, 0]
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full animate-spin-slow"></div>
                    <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-sm animate-pulse"></div>
                    <div className="relative p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl">
                        <Sparkles size={48} className="text-blue-400" />
                    </div>
                </motion.div>

                {/* Loading text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center mb-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-2">
                        AI Outreach Studio
                    </h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="text-zinc-400"
                    >
                        Analyzing prospect data...
                    </motion.p>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="w-64 mb-8"
                >
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                delay: 1,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>

                {/* Loading steps */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="text-center space-y-2"
                >
                    {[
                        { text: "Scraping founder data", delay: 0 },
                        { text: "Processing AI insights", delay: 1000 },
                        { text: "Generating email content", delay: 2000 }
                    ].map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: [0, 1, 0.6] }}
                            transition={{
                                delay: step.delay / 1000 + 1.5,
                                duration: 0.8,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                            className="flex items-center gap-3 text-sm text-zinc-500 justify-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ 
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="w-4 h-4 border-2 border-zinc-700 border-t-blue-400 rounded-full"
                            />
                            <span>{step.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Static floating dots */}
                <div className="absolute inset-0 pointer-events-none">
                    {floatingDots.map((dot, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                            style={{
                                left: `${dot.left}%`,
                                top: `${dot.top}%`,
                            }}
                            animate={{
                                y: [-20, -40, -20],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};