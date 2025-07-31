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
import { Header } from './Header';
import { HomeLoadingScreen } from './LoadingScreen';
import { supabase } from '../lib/supabaseclient'
import { createClient } from '../lib/server';
import type { Session } from '@supabase/supabase-js';

import { X, Lock, EyeOff } from 'lucide-react';

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
<div>




</div>


// Main App Component with proper API integration
export function AppClient({ serverSession }: { serverSession: Session | null }) {
    const [email, setEmail] = useState(aiAnalysis.initialEmail);
    const [talkingPoints] = useState(aiAnalysis.talkingPoints);
    const [isFounderConfirmed, setIsFounderConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [HomeLoading, setHomeLoading] = useState(true);
    const [FounderDataFinal, setFounderDataFinal] = useState<FounderData | null>(null);
    const [error, setError] = useState<string | null>(null);

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


    const onConfirmfounder = async () => {
        const res = await fetch('/api/coldmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company: 'Notion', // This should come from URL params or props
                founder: FounderDataFinal?.name,
                UserName: serverSession?.user ?? null
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

<Header
        isLoggedIn={!!serverSession}
        user={serverSession?.user ?? null}
    />

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
                                                        className={`group cursor-pointer rounded-xl transition-all duration-200 ${point.priority === 'high'
                                                                ? `${colors.cardBg} ${colors.border} border hover:${colors.hoverBg} hover:border-emerald-500/50`
                                                                : `${colors.cardBg} ${colors.border} border hover:${colors.hoverBg}`
                                                            }`}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="p-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className={`flex-shrink-0 p-2 rounded-lg transition-all ${point.priority === 'high'
                                                                        ? 'bg-emerald-500/10 text-emerald-400'
                                                                        : 'bg-zinc-800 text-zinc-400 group-hover:bg-blue-500 group-hover:text-white'
                                                                    }`}>
                                                                    <point.IconComponent size={14} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${point.priority === 'high'
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
                                                    <div className={`p-2 rounded-lg ${activity.type === 'meeting_booked' ? 'bg-emerald-500/10 text-emerald-400' :
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
                                                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-emerald-400' :
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

