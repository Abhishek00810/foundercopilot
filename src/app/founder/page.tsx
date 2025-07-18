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

const colors = {
    bg: 'bg-black',
    cardBg: 'bg-zinc-950',
    hoverBg: 'bg-zinc-900',
    border: 'border-zinc-800',
    borderLight: 'border-zinc-700',
    text: 'text-white',
    textSecondary: 'text-zinc-400',
    textMuted: 'text-zinc-600',
    primary: 'text-blue-500',
    primaryBg: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    success: 'text-emerald-400',
    successBg: 'bg-emerald-500',
    successHover: 'hover:bg-emerald-600',
    warning: 'text-yellow-400',
    warningBg: 'bg-yellow-500',
    buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
    buttonSecondary: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
    buttonGhost: 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
};

interface UserProfile {
    name: string;
    signature: string;
    avatar: string;
    role: string;
    company: string;
}

interface FounderData {
    name: string;
    firstName: string;
    title: string;
    company: string;
    avatarUrl: string;
    linkedin?: string;
    twitter?: string;
    location?: string;
    founded?: string;
    confidence?: number;
    revenue?: string;
    employees?: string;
    lastFunding?: string;
    industry?: string;
}

interface RecentActivity {
    id: string;
    type: 'email_sent' | 'reply_received' | 'meeting_booked';
    prospect: string;
    timestamp: string;
    status: 'success' | 'pending' | 'failed';
}

// Static data
const userProfile: UserProfile = {
    name: 'Alex Chen',
    signature: 'Best regards,\nAlex Chen\nSenior Account Executive\nDevTools Pro',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
    role: 'Senior Account Executive',
    company: 'DevTools Pro'
};

const recentActivity: RecentActivity[] = [
    { id: '1', type: 'meeting_booked', prospect: 'Sarah Kim (TechFlow)', timestamp: '2 minutes ago', status: 'success' },
    { id: '2', type: 'reply_received', prospect: 'Marcus Johnson (DataLabs)', timestamp: '15 minutes ago', status: 'success' },
    { id: '3', type: 'email_sent', prospect: 'Elena Rodriguez (SynthWave AI)', timestamp: '1 hour ago', status: 'pending' }
];

const aiAnalysis = {
    talkingPoints: [
        {
            id: 1,
            IconComponent: TrendingUp,
            text: "Just raised $15M Series A - perfect timing for growth solutions",
            priority: "high" as const,
            snippet: "Huge congratulations on the recent $15M Series A! It's clear validation of the incredible value you're building at {companyName}. This is exactly the kind of growth moment where the right dev tools can make all the difference.",
            confidence: 95
        },
        {
            id: 2,
            IconComponent: MessageSquare,
            text: "Featured on 'Code & Capital' podcast discussing AI development trends",
            priority: "medium" as const,
            snippet: "I caught your recent appearance on the 'Code & Capital' podcast - your insights on AI development workflows really resonated with me. It's clear you're thinking deeply about developer experience.",
            confidence: 87
        },
        {
            id: 3,
            IconComponent: Building,
            text: "Expanding team rapidly in SF - likely facing scaling challenges",
            priority: "high" as const,
            snippet: "I noticed you're scaling the team rapidly in San Francisco. Having worked with similar high-growth AI companies, I know how critical the right development infrastructure becomes at this stage.",
            confidence: 82
        },
        {
            id: 4,
            IconComponent: Award,
            text: "Won 'Best AI Startup' at TechCrunch Disrupt 2024",
            priority: "medium" as const,
            snippet: "Congrats on winning 'Best AI Startup' at TechCrunch Disrupt! That level of recognition speaks volumes about what you're building. I'd love to discuss how we can support your continued momentum.",
            confidence: 90
        }
    ],
    initialEmail: {
        subject: "Quick idea for {companyName}'s deployment pipeline",
        body: `Hi {firstName},

Came across {companyName} and I'm genuinely impressed with your mission to accelerate AI development cycles.

I help fast-growing AI companies like yours implement automated security and quality checks directly into their deployment pipeline - something that becomes critical as you scale beyond 50 engineers.

Would you be open to a brief 15-minute chat next week? I think there's a compelling opportunity here.

{[Signature]}`
    }
};

// Fixed HomeLoadingScreen - removed Math.random()
const HomeLoadingScreen = () => {
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

// ... (keep all other components exactly the same)

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullname, setFullname] = useState('')
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const openLoginModal = () => {
        setShowSignUpModal(false);
        setShowLoginModal(true);
    };

    const openSignUpModal = () => {
        setShowLoginModal(false);
        setShowSignUpModal(true);
    };

    const closeModals = () => {
        setShowLoginModal(false);
        setShowSignUpModal(false);
    };

    const onSignup = async (e: React.FormEvent) => {
        console.log('submit')
        e.preventDefault()
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setError(error.message)
        else router.push('/welcome') // Redirect after signup
    

      }
    return (
        <>
            <div className={`fixed top-0 left-0 right-0 z-50 ${colors.bg} ${colors.border} border-b backdrop-blur-sm`}>
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 ${colors.primaryBg} rounded-lg shadow-lg`}>
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold ${colors.text}`}>
                                AI Outreach Studio
                            </h1>
                            <p className={`text-xs ${colors.textMuted}`}>Powered by GPT-4</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-400 font-medium">Live</span>
                        </div>
                        
                        <button className={`p-2 ${colors.buttonGhost} rounded-lg transition-all hover:scale-105`}>
                            <Settings size={18} />
                        </button>
                        
                        {/* Authentication Buttons */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={openLoginModal}
                                className={`px-4 py-2 text-sm font-medium ${colors.text} hover:${colors.textMuted} transition-all duration-200 hover:scale-105`}
                            >
                                Login
                            </button>
                            <button 
                                onClick={openSignUpModal}
                                className={`px-6 py-2 ${colors.primaryBg} text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg transform`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                        onClick={closeModals}
                    ></div>
                    
                    {/* Modal */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-modal-in">
                        {/* Close Button */}
                        <button 
                            onClick={closeModals}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X size={20} />
                        </button>

                        {/* Header */}
                        <div className="p-8 pb-6">
                            <div className="text-center mb-8">
                                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                                <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                    
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                                    </label>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                                >
                                    Sign In
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={openSignUpModal}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sign Up Modal */}
            {showSignUpModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                        onClick={closeModals}
                    ></div>
                    
                    {/* Modal */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-modal-in">
                        {/* Close Button */}
                        <button 
                            onClick={closeModals}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X size={20} />
                        </button>

                        {/* Header */}
                        <div className="p-8 pb-6">
                            <div className="text-center mb-8">
                                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                    <User size={24} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                                <p className="text-gray-600 dark:text-gray-400">Join AI Outreach Studio today</p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6" onSubmit={onSignup}>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            onChange={(e) => setFullname(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                    
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        I agree to the{' '}
                                        <a href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">Privacy Policy</a>
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                                >
                                    Create Account
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <button 
                                        onClick={openLoginModal}
                                        className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
// ... (keep all other components: ActivityFeed, FounderVerification, etc.)

// Main App Component with proper API integration
function App() {
    const [email, setEmail] = useState(aiAnalysis.initialEmail);
    const [talkingPoints] = useState(aiAnalysis.talkingPoints);
    const [isFounderConfirmed, setIsFounderConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [HomeLoading, setHomeLoading] = useState(true);
    const [FounderDataFinal, setFounderDataFinal] = useState<FounderData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Rendered once");
      }, []);
      
    useEffect(() => {
        async function fetchFounderData() {
            try {
                setError(null);
                const res = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        company: 'Notion', // This should come from URL params or props
                    }),
                });

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const data = await res.json();

                if (data.best_pick) {
                    setFounderDataFinal(data.best_pick);
                } else {
                    throw new Error('Invalid API response');
                }
            } catch (err: any) {
                console.error('❌ Failed to fetch founder data:', err);
                setError(err.message);
                // Set fallback data
                setFounderDataFinal({
                    name: 'No founded error',
                    firstName: 'Ivan',
                    title: 'CEO',
                    company: 'Notion',
                    avatarUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
                    linkedin: 'https://linkedin.com/in/ivan',
                    twitter: 'https://twitter.com/ivan',
                    location: 'San Francisco, CA',
                    founded: '2016',
                    confidence: 85,
                    revenue: '$50M ARR',
                    employees: '200-500',
                    lastFunding: 'Series C - $50M',
                    industry: 'Productivity'
                });
            } finally {
                setHomeLoading(false);
            }
        }

        fetchFounderData();
    }, []);


     const onConfirmfounder = async()=>{
        const res = await fetch('/api/coldmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company: 'Notion', // This should come from URL params or props
                founder: FounderDataFinal?.name
            }),
        });
        const data = await res.json();
        console.log(data.result)
        setEmail(data.result)

        setIsFounderConfirmed(true);
    }

    const handleInsertSnippet = (snippet: string) => {
        if (!FounderDataFinal) return;
        const newBody = `${email.trim()}\n\n${snippet.replace(/{companyName}/g, FounderDataFinal.company)}`;
        setEmail({ ...email, body: newBody });
        toast.success('Insight added to email!', { 
            icon: '✨',
            style: {
                background: '#0a0a0a',
                color: 'white',
                border: '1px solid #27272a'
            }
        });
    };

    const handleRegenerate = async () => {
        setLoading(true);
        toast.loading("AI is crafting a new version...", { id: 'regen' });
        
        await new Promise(r => setTimeout(r, 2000));
        
        const variations = [
            {
                subject: "Partnership opportunity for {companyName}",
                body: `Hi {firstName},\n\nJust learned about {companyName}'s recent success - what an incredible milestone!\n\nI work with fast-scaling companies to implement enterprise-grade security frameworks that grow with your team.\n\nGiven your rapid expansion, I think there's a meaningful opportunity to discuss.\n\nInterested in a quick call?\n\n{[Signature]}`
            },
            {
                subject: "Scaling challenges at {companyName}?",
                body: `Hi {firstName},\n\nImpressive work at {companyName} - your approach to development is exactly what the industry needs.\n\nAs you scale, I imagine code review and deployment security are becoming critical bottlenecks.\n\nI help companies like yours automate these processes without slowing down innovation.\n\nWorth a 15-minute conversation?\n\n{[Signature]}`
            }
        ];
        
        const randomVariation = variations[Math.floor(Math.random() * variations.length)];
        setEmail(randomVariation);
        setLoading(false);
        toast.success("New email generated!", { 
            id: 'regen',
            icon: '🎯',
            style: {
                background: '#0a0a0a',
                color: 'white',
                border: '1px solid #27272a'
            }
        });
    };

    // Show loading screen
    if (HomeLoading) {
        return (
            <>
                <style jsx global>{`
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 8s linear infinite;
                    }
                `}</style>
                <HomeLoadingScreen />
            </>
        );
    }

    // Show error state
    if (error || !FounderDataFinal) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                    <p className="text-zinc-400 mb-6">{error || 'Failed to load founder data'}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${colors.bg} ${colors.text} font-sans antialiased`}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                :root { --font-sans: 'Inter', sans-serif; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #000000; }
                ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
            `}</style>

            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: {
                        background: '#0a0a0a',
                        color: '#ffffff',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                    }
                }}
            />

            <Header />

            <main className="flex h-screen pt-16">
                {/* Sidebar */}
                <div className={`w-100 flex-shrink-0 pl-4 ${colors.border} border-r overflow-y-auto`}>
                    <div className="p-6 space-y-6">
                        {/* Founder Verification */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isFounderConfirmed ? 'confirmed' : 'verification'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isFounderConfirmed ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <CheckCircle className="text-emerald-400" size={24} />
                                                <div>
                                                    <p className={`font-bold ${colors.text} text-lg`}>{FounderDataFinal.name}</p>
                                                    <p className="text-emerald-400">{FounderDataFinal.company} • {FounderDataFinal.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                                        <span className="text-xs text-emerald-300">Ready for outreach</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setIsFounderConfirmed(false)}
                                                className={`p-2 text-emerald-300 ${colors.buttonGhost} rounded transition-all`}
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        className={`${colors.cardBg} rounded-xl p-6 ${colors.border} border`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <h3 className={`text-lg font-semibold ${colors.text} flex items-center gap-3`}>
                                                <User size={18} className={colors.primary} />
                                                Prospect Verification
                                            </h3>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <span className="text-xs text-emerald-400 font-medium">{FounderDataFinal.confidence}% match</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="relative">
                                                <img 
                                                    src={FounderDataFinal.avatarUrl} 
                                                    alt={FounderDataFinal.name} 
                                                    className="w-16 h-16 rounded-xl object-cover" 
                                                />
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle size={12} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-xl font-bold ${colors.text} mb-1`}>{FounderDataFinal.name}</h4>
                                                <p className={`${colors.textSecondary} mb-2`}>{FounderDataFinal.title}</p>
                                                <div className={`flex items-center gap-4 text-sm ${colors.textMuted}`}>
                                                    <span className="flex items-center gap-1">
                                                        <Building size={12} />
                                                        {FounderDataFinal.company}
                                                    </span>
                                                    {FounderDataFinal.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={12} />
                                                            {FounderDataFinal.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className={`${colors.bg} rounded-lg p-4`}>
                                                <p className={`text-xs ${colors.textMuted} mb-1`}>Revenue</p>
                                                <p className={`text-sm font-semibold ${colors.success}`}>{FounderDataFinal.revenue}</p>
                                            </div>
                                            <div className={`${colors.bg} rounded-lg p-4`}>
                                                <p className={`text-xs ${colors.textMuted} mb-1`}>Last Funding</p>
                                                <p className={`text-sm font-semibold ${colors.primary}`}>{FounderDataFinal.lastFunding}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <motion.button
                                                onClick={() => onConfirmfounder()}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 ${colors.buttonPrimary} text-sm rounded-lg font-medium transition-all`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <CheckCircle size={16} />
                                                Confirm & Continue
                                            </motion.button>
                                            <motion.button
                                                className={`px-4 py-3 ${colors.buttonSecondary} text-sm rounded-lg font-medium transition-all`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Search size={16} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* AI Insights & Controls */}
                        <AnimatePresence>
                            {isFounderConfirmed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* AI Insights */}
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={`text-lg font-semibold ${colors.text} flex items-center gap-3`}>
                                                <BrainCircuit size={18} className={colors.primary} />
                                                AI Insights
                                            </h3>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                                <span className={`text-xs ${colors.primary} font-medium`}>Live</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {talkingPoints.map((point, index) => (
                                                <motion.div
                                                    key={point.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <motion.div
                                                        onClick={() => handleInsertSnippet(point.snippet)}
                                                        className={`group cursor-pointer rounded-xl transition-all duration-200 ${
                                                            point.priority === 'high' 
                                                                ? `${colors.cardBg} ${colors.border} border hover:${colors.hoverBg} hover:border-emerald-500/50` 
                                                                : `${colors.cardBg} ${colors.border} border hover:${colors.hoverBg}`
                                                        }`}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="p-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                                                                    point.priority === 'high' 
                                                                        ? 'bg-emerald-500/10 text-emerald-400' 
                                                                        : 'bg-zinc-800 text-zinc-400 group-hover:bg-blue-500 group-hover:text-white'
                                                                }`}>
                                                                    <point.IconComponent size={14} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                                            point.priority === 'high' 
                                                                                ? 'bg-emerald-500/10 text-emerald-400' 
                                                                                : point.priority === 'medium'
                                                                                ? 'bg-blue-500/10 text-blue-400'
                                                                                : 'bg-zinc-500/10 text-zinc-400'
                                                                        }`}>
                                                                            {point.priority.toUpperCase()}
                                                                        </span>
                                                                        <div className="flex items-center gap-1">
                                                                            <Star size={10} className={colors.warning} />
                                                                            <span className={`text-xs ${colors.textMuted}`}>{point.confidence}%</span>
                                                                        </div>
                                                                    </div>
                                                                    <p className={`${colors.textSecondary} text-sm leading-relaxed group-hover:${colors.text} transition-colors`}>
                                                                        {point.text}
                                                                    </p>
                                                                    <div className="flex items-center justify-between mt-3">
                                                                        <span className={`text-xs ${colors.textMuted}`}>Click to add to email</span>
                                                                        <ChevronRight size={12} className={`${colors.textMuted} group-hover:${colors.text} transition-colors`} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* AI Controls */}
                                    <section>
                                        <h3 className={`text-lg font-semibold ${colors.text} mb-4 flex items-center gap-3`}>
                                            <Wand2 size={18} className="text-purple-400" />
                                            AI Controls
                                        </h3>
                                        <div className="space-y-3">
                                            <motion.button
                                                disabled={loading}
                                                onClick={handleRegenerate}
                                                className={`w-full flex items-center justify-center gap-3 px-4 py-3 ${colors.buttonPrimary} text-sm rounded-lg font-medium transition-all disabled:opacity-50`}
                                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                            >
                                                {loading ? (
                                                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                                ) : (
                                                    <RefreshCw size={14} />
                                                )}
                                                {loading ? "Regenerating..." : "Generate New Version"}
                                            </motion.button>
                                            
                                            <motion.button
                                                className={`w-full flex items-center justify-center gap-3 px-4 py-3 ${colors.buttonSecondary} text-sm rounded-lg font-medium transition-all`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Plus size={14} />
                                                Add Custom Insight
                                            </motion.button>
                                        </div>
                                    </section>

                                    {/* Activity Feed */}
                                    <div className={`${colors.cardBg} rounded-xl p-6 ${colors.border} border`}>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className={`text-lg font-semibold ${colors.text} flex items-center gap-3`}>
                                                <Clock size={18} className={colors.primary} />
                                                Recent Activity
                                            </h3>
                                            <button className={`${colors.buttonGhost} p-1 rounded transition-all`}>
                                                <Eye size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {recentActivity.map((activity, index) => (
                                                <motion.div
                                                    key={activity.id}
                                                    className={`flex items-center gap-4 p-3 rounded-lg ${colors.hoverBg} transition-all cursor-pointer`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className={`p-2 rounded-lg ${
                                                        activity.type === 'meeting_booked' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        activity.type === 'reply_received' ? 'bg-blue-500/10 text-blue-400' :
                                                        'bg-yellow-500/10 text-yellow-400'
                                                    }`}>
                                                        {activity.type === 'meeting_booked' ? <Calendar size={14} /> :
                                                         activity.type === 'reply_received' ? <MessageSquare size={14} /> :
                                                         <Mail size={14} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${colors.text}`}>{activity.prospect}</p>
                                                        <p className={`text-xs ${colors.textSecondary}`}>{activity.timestamp}</p>
                                                    </div>
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        activity.status === 'success' ? 'bg-emerald-400' :
                                                        activity.status === 'pending' ? 'bg-yellow-400' :
                                                        'bg-red-400'
                                                    }`}></div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isFounderConfirmed ? 'email' : 'initial'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {isFounderConfirmed ? (
                                <div className="h-full flex flex-col">
                                    {/* Header */}
                                    <div className={`${colors.border} border-b p-6 ${colors.cardBg}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className={`text-2xl font-bold ${colors.text} mb-1`}>{email.subject}</h2>
                                                <div className={`flex items-center gap-4 text-sm ${colors.textSecondary}`}>
                                                    <span>To: {FounderDataFinal.name} ({FounderDataFinal.title})</span>
                                                    <div className="flex items-center gap-1">
                                                        <Eye size={12} />
                                                        <span>Preview Mode</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full">
                                                <Brain size={12} className={colors.primary} />
                                                <span className={`text-xs ${colors.primary} font-medium`}>AI Generated</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Content */}
                                    <div className="flex-1 overflow-y-auto p-8">
                                        <div className="max-w-4xl mx-auto">
                                            <motion.div
                                                className="bg-white text-slate-800 rounded-xl shadow-xl overflow-hidden"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <div className="p-8">
                                                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                                                        {email}
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
                                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                                        <span>Sent via AI Outreach Studio</span>
                                                        <div className="flex items-center gap-3">
                                                            <button className="hover:text-slate-700 transition-colors">
                                                                <Bookmark size={14} />
                                                            </button>
                                                            <button className="hover:text-slate-700 transition-colors">
                                                                <Share2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className={`${colors.border} border-t ${colors.cardBg} p-6`}>
                                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                                            <div className="flex items-center gap-6">
                                                <div className={`flex items-center gap-2 text-sm ${colors.textSecondary}`}>
                                                    <MousePointer size={14} />
                                                    <span>Expected open rate: <span className={colors.success}>74%</span></span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-sm ${colors.textSecondary}`}>
                                                    <Target size={14} />
                                                    <span>Reply probability: <span className={colors.primary}>28%</span></span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <motion.button
                                                    onClick={() => {
                                                        toast.success("Email copied to clipboard!", { icon: '📋' });
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 ${colors.buttonSecondary} text-sm rounded-lg font-medium transition-all`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Copy size={14} />
                                                    Copy
                                                </motion.button>
                                                
                                                <motion.button
                                                    className={`flex items-center gap-2 px-4 py-2 ${colors.buttonSecondary} text-sm rounded-lg font-medium transition-all`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Download size={14} />
                                                    Export
                                                </motion.button>
                                                
                                                <motion.a
                                                    className={`flex items-center gap-2 px-6 py-2 ${colors.buttonPrimary} text-sm rounded-lg font-medium transition-all shadow-lg`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Send size={14} />
                                                    Send Email
                                                </motion.a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="flex flex-col items-center max-w-lg"
                                    >
                                        <div className={`p-8 ${colors.cardBg} rounded-2xl ${colors.border} border mb-8`}>
                                            <UserCheck size={48} className={colors.primary} />
                                        </div>
                                        
                                        <h2 className={`text-3xl font-bold ${colors.text} mb-4`}>
                                            Verify Your Prospect
                                        </h2>
                                        <p className={`text-lg ${colors.textSecondary} mb-8 leading-relaxed`}>
                                            Confirm the founder details to unlock AI-powered insights and generate a personalized outreach email that converts.
                                        </p>
                                        
                                        <div className={`flex items-center gap-6 text-sm ${colors.textMuted}`}>
                                            <div className="flex items-center gap-2">
                                                <Brain size={16} className={colors.primary} />
                                                <span>AI Analysis</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Zap size={16} className={colors.warning} />
                                                <span>Smart Insights</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Target size={16} className={colors.success} />
                                                <span>High Conversion</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default App;