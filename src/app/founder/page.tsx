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

// Space black theme with cleaner colors
const colors = {
    // Backgrounds
    bg: 'bg-black',
    cardBg: 'bg-zinc-950',
    hoverBg: 'bg-zinc-900',
    
    // Borders
    border: 'border-zinc-800',
    borderLight: 'border-zinc-700',
    
    // Text
    text: 'text-white',
    textSecondary: 'text-zinc-400',
    textMuted: 'text-zinc-600',
    
    // Accent colors (Next.js style)
    primary: 'text-blue-500',
    primaryBg: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    
    success: 'text-emerald-400',
    successBg: 'bg-emerald-500',
    successHover: 'hover:bg-emerald-600',
    
    warning: 'text-yellow-400',
    warningBg: 'bg-yellow-500',
    
    // Interactive elements
    buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
    buttonSecondary: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
    buttonGhost: 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
};

// Enhanced TypeScript interfaces
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

// Enhanced mock data
const founderData: FounderData = {
    name: 'Elena Rodriguez',
    firstName: 'Elena',
    title: 'CEO & Co-founder',
    company: 'SynthWave AI',
    avatarUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    linkedin: 'https://linkedin.com/in/elena',
    twitter: 'https://twitter.com/elena',
    location: 'San Francisco, CA',
    founded: '2022',
    confidence: 92,
    revenue: '$2.5M ARR',
    employees: '25-50',
    lastFunding: 'Series A - $15M',
    industry: 'AI/ML'
};


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

// Enhanced Components

const Header = () => (
    <div className={`fixed top-0 left-0 right-0 z-50 ${colors.bg} ${colors.border} border-b`}>
        <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
                <div className={`p-2 ${colors.primaryBg} rounded-lg`}>
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
                
                <button className={`p-2 ${colors.buttonGhost} rounded-lg transition-all`}>
                    <Settings size={18} />
                </button>
                
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className={`text-sm font-medium ${colors.text}`}>{userProfile.name}</p>
                        <p className={`text-xs ${colors.textSecondary}`}>{userProfile.role}</p>
                    </div>
                    <img 
                        src={userProfile.avatar} 
                        alt="User avatar" 
                        className="w-8 h-8 rounded-full object-cover" 
                    />
                </div>
            </div>
        </div>
    </div>
);


// Enhanced Loading Component
const HomeLoadingScreen = () => (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main loading content */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
        >
            {/* Logo/Icon with pulse animation */}
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
                {/* Outer ring */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full animate-spin-slow"></div>
                
                {/* Inner glow */}
                <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-sm animate-pulse"></div>
                
                {/* Main icon container */}
                <div className="relative p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl">
                    <Sparkles size={48} className="text-blue-400" />
                </div>
            </motion.div>

            {/* Loading text with typewriter effect */}
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
                    Initializing AI-powered insights...
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
                            ease: "easeInOut",
                            repeat: Infinity
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
                    { text: "Loading AI models", delay: 0 },
                    { text: "Preparing insights engine", delay: 1000 },
                    { text: "Setting up workspace", delay: 2000 }
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
                                ease: "linear",
                                delay: step.delay / 1000 + 1.5
                            }}
                            className="w-4 h-4 border-2 border-zinc-700 border-t-blue-400 rounded-full"
                        />
                        <span>{step.text}</span>
                    </motion.div>
                ))}
            </motion.div>

            {/* Subtle floating dots */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
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

        {/* Bottom fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
);

// Custom CSS for slow spin animation
const LoadingStyles = () => (
    <style jsx global>{`
        @keyframes spin-slow {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        
        .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
        }
        
        @keyframes pulse-glow {
            0%, 100% {
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            50% {
                box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
            }
        }
        
        .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
        }
    `}</style>
);
const ActivityFeed = () => (
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
);

const FounderVerification = ({ founder, onConfirm, onSearch }: { 
    founder: FounderData; 
    onConfirm: () => void; 
    onSearch: () => void 
}) => (
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
                <span className="text-xs text-emerald-400 font-medium">{founder.confidence}% match</span>
            </div>
        </div>

        <div className="flex items-start gap-4 mb-6">
            <div className="relative">
                <img 
                    src={founder.avatarUrl} 
                    alt={founder.name} 
                    className="w-16 h-16 rounded-xl object-cover" 
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                </div>
            </div>
            <div className="flex-1">
                <h4 className={`text-xl font-bold ${colors.text} mb-1`}>{founder.name}</h4>
                <p className={`${colors.textSecondary} mb-2`}>{founder.title}</p>
                <div className={`flex items-center gap-4 text-sm ${colors.textMuted}`}>
                    <span className="flex items-center gap-1">
                        <Building size={12} />
                        {founder.company}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {founder.location}
                    </span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${colors.bg} rounded-lg p-4`}>
                <p className={`text-xs ${colors.textMuted} mb-1`}>Revenue</p>
                <p className={`text-sm font-semibold ${colors.success}`}>{founder.revenue}</p>
            </div>
            <div className={`${colors.bg} rounded-lg p-4`}>
                <p className={`text-xs ${colors.textMuted} mb-1`}>Last Funding</p>
                <p className={`text-sm font-semibold ${colors.primary}`}>{founder.lastFunding}</p>
            </div>
        </div>

        <div className="flex gap-3">
            <motion.button
                onClick={onConfirm}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 ${colors.buttonPrimary} text-sm rounded-lg font-medium transition-all`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <CheckCircle size={16} />
                Confirm & Continue
            </motion.button>
            <motion.button
                onClick={onSearch}
                className={`px-4 py-3 ${colors.buttonSecondary} text-sm rounded-lg font-medium transition-all`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Search size={16} />
            </motion.button>
        </div>
    </motion.div>
);

const FounderConfirmed = ({ founder, onEdit }: { founder: FounderData; onEdit: () => void }) => (
    
    <motion.div
        className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <CheckCircle className="text-emerald-400" size={24} />
                <div>
                    <p className={`font-bold ${colors.text} text-lg`}>{founder.name}</p>
                    <p className="text-emerald-400">{founder.company} • {founder.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-300">Ready for outreach</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onEdit}
                className={`p-2 text-emerald-300 ${colors.buttonGhost} rounded transition-all`}
            >
                <Edit size={16} />
            </button>
        </div>
    </motion.div>
);

const InitialStateDisplay = () => (
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
);

const EmailDisplay = ({ email, getRenderedEmailBody }: { 
    email: { subject: string, body: string }; 
    getRenderedEmailBody: (body: string) => string 
}) => (
    <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`${colors.border} border-b p-6 ${colors.cardBg}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${colors.text} mb-1`}>{email.subject}</h2>
                    <div className={`flex items-center gap-4 text-sm ${colors.textSecondary}`}>
                        <span>To: {founderData.name} ({founderData.title})</span>
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
                            {getRenderedEmailBody(email.body)}
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
                            navigator.clipboard.writeText(getRenderedEmailBody(email.body));
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
                        href={`mailto:${founderData.name}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(getRenderedEmailBody(email.body))}`}
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
);

const TalkingPoint = ({ 
    icon, 
    text, 
    confidence, 
    priority, 
    onInsert 
}: { 
    icon: React.ReactNode;
    text: string;
    confidence: number;
    priority: 'high' | 'medium' | 'low';
    onInsert: () => void;
}) => (
    <motion.div
        onClick={onInsert}
        className={`group cursor-pointer rounded-xl transition-all duration-200 ${
            priority === 'high' 
                ? `${colors.cardBg} ${colors.border} border hover:${colors.hoverBg} hover:border-emerald-500/50` 
                : `${colors.cardBg} ${colors.border} border hover:${colors.hoverBg}`
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
    >
        <div className="p-4">
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                    priority === 'high' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-zinc-800 text-zinc-400 group-hover:bg-blue-500 group-hover:text-white'
                }`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            priority === 'high' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : priority === 'medium'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-zinc-500/10 text-zinc-400'
                        }`}>
                            {priority.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star size={10} className={colors.warning} />
                            <span className={`text-xs ${colors.textMuted}`}>{confidence}%</span>
                        </div>
                    </div>
                    <p className={`${colors.textSecondary} text-sm leading-relaxed group-hover:${colors.text} transition-colors`}>
                        {text}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs ${colors.textMuted}`}>Click to add to email</span>
                        <ChevronRight size={12} className={`${colors.textMuted} group-hover:${colors.text} transition-colors`} />
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

// Main App Component
function App() {
    const [email, setEmail] = useState(aiAnalysis.initialEmail);
    const [talkingPoints] = useState(aiAnalysis.talkingPoints);
    const [isFounderConfirmed, setIsFounderConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [HomeLoading, setHomeLoading] = useState(true);
    const [FounderDataFinal, setFounderDataFinal] = useState<FounderData>({
        name: 'Null',
        firstName: 'Elena',
        title: 'CEO & Co-founder',
        company: 'SynthWave AI',
        avatarUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
        linkedin: 'https://linkedin.com/in/elena',
        twitter: 'https://twitter.com/elena',
        location: 'San Francisco, CA',
        founded: '2022',
        confidence: 92,
        revenue: '$2.5M ARR',
        employees: '25-50',
        lastFunding: 'Series A - $15M',
        industry: 'AI/ML'
    });

    useEffect(() => {
        async function sendPostRequest() {
          try {
            const res = await fetch('/api/scrape', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: 'SynthWave AI',
              }),
            });
      
            const data = await res.json();
            
            console.log('Response from POST:', data);
            
            setFounderDataFinal({
                name: data.best_pick.name,
                firstName: 'Elena',
                title: data.best_pick.title,
                company: data.company,
                avatarUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
                linkedin: 'https://linkedin.com/in/elena',
                twitter: 'https://twitter.com/elena',
                location: 'San Francisco, CA',
                founded: '2022',
                confidence: 92,
                revenue: '$2.5M ARR',
                employees: '25-50',
                lastFunding: 'Series A - $15M',
                industry: 'AI/ML'
            })
          } catch (err) {
            console.error('POST request failed:', err);
          }
          finally{
            setHomeLoading(false);
          }
        }
      
        sendPostRequest();
      }, []);
      
    
    const getRenderedEmailBody = useCallback(
        (body: string) =>
            body
                .replace(/{firstName}/g, founderData.firstName)
                .replace(/{companyName}/g, founderData.company)
                .replace(/{\[Signature\]}/g, userProfile.signature),
        [userProfile.signature]
    );

    const handleInsertSnippet = (snippet: string) => {
        const newBody = `${email.body.trim()}\n\n${snippet.replace(/{companyName}/g, founderData.company)}`;
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
                body: `Hi {firstName},\n\nJust learned about {companyName}'s recent Series A success - what an incredible milestone!\n\nI work with fast-scaling AI companies to implement enterprise-grade security frameworks that grow with your team.\n\nGiven your rapid expansion, I think there's a meaningful opportunity to discuss.\n\nInterested in a quick call?\n\n{[Signature]}`
            },
            {
                subject: "Scaling challenges at {companyName}?",
                body: `Hi {firstName},\n\nImpressive work at {companyName} - your approach to AI development is exactly what the industry needs.\n\nAs you scale beyond 50 engineers, I imagine code review and deployment security are becoming critical bottlenecks.\n\nI help companies like yours automate these processes without slowing down innovation.\n\nWorth a 15-minute conversation?\n\n{[Signature]}`
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


    return HomeLoading ? (
        <>
            <LoadingStyles />
            <HomeLoadingScreen />
        </>
    ) : 
    (
        <div className={`min-h-screen ${colors.bg} ${colors.text} font-sans antialiased`}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                :root {
                    --font-sans: 'Inter', sans-serif;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #000000;
                }
                ::-webkit-scrollbar-thumb {
                    background: #27272a;
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #3f3f46;
                }
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

            {/* Main Content */}
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
                                    <FounderConfirmed 
                                        founder={FounderDataFinal} 
                                        onEdit={() => setIsFounderConfirmed(false)} 
                                    />
                                ) : (
                                    <FounderVerification
                                        founder={FounderDataFinal}
                                        onConfirm={() => setIsFounderConfirmed(true)}
                                        onSearch={() => {}}
                                    />
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
                                                    <TalkingPoint
                                                        icon={<point.IconComponent size={14} />}
                                                        text={point.text}
                                                        confidence={point.confidence}
                                                        priority={point.priority}
                                                        onInsert={() => handleInsertSnippet(point.snippet)}
                                                    />
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
                                    <ActivityFeed />
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
                                <EmailDisplay 
                                    email={email} 
                                    getRenderedEmailBody={getRenderedEmailBody} 
                                />
                            ) : (
                                <InitialStateDisplay />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default App;