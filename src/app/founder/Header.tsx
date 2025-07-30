'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
    User, MessageSquare, BrainCircuit, Copy, Wand2, Send, TrendingUp, 
    Settings, Sparkles, CheckCircle, Search, ArrowLeft, MapPin,
    Building, ExternalLink, UserCheck, Edit, BarChart3, Target,
    Clock, Mail, Zap, Brain, Globe, Star, Award, Briefcase,
    Calendar, Eye, MousePointer, Users, ChevronRight, Plus,
    Filter, Download, RefreshCw, Heart, Share2, Bookmark,
    LogOut, X, Lock, EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Correctly import your client-side Supabase instance
import { createClient } from '../lib/client';


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

// Define a type for the user object from Supabase for better type safety
type User = {
    id: string;
    email?: string;
    // Add other user properties if you need them
};

type HeaderProps = {
    isLoggedIn: boolean;
    user: User | null;
};

export const Header = ({ isLoggedIn, user }: HeaderProps) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // State for Sign Up form
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [fullname, setFullname] = useState('');
    
    // State for Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const router = useRouter();
    const supabase = createClient();

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
        e.preventDefault();
        const toastId = toast.loading('Creating your account...');
        const { error } = await supabase.auth.signUp({ 
            email: signUpEmail, 
            password: signUpPassword,
            options: {
                data: {
                    full_name: fullname,
                }
            }
        });

        if (error) {
            toast.error(error.message, { id: toastId });
        } else {
            toast.success('Success! Please check your email to verify your account.', { id: toastId });
            closeModals();
            // You don't need to refresh here, as user needs to verify email first
        }
    };

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Signing in...');
        const { error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: loginPassword,
        });

        if (error) {
            toast.error(error.message, { id: toastId });
        } else {
            toast.success('Successfully signed in!', { id: toastId });
            closeModals();
            // THIS IS THE KEY: Refresh the page to update the server-side session
            router.refresh();
        }
    };

    const handleLogout = async () => {
        const toastId = toast.loading('Signing out...');
        await supabase.auth.signOut();
        toast.success('Successfully signed out!', { id: toastId });
        // Refresh the page to reflect the logged-out state
        router.refresh();
    };

    return (
        <>
            {/* Toaster for notifications */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className={`fixed top-0 left-0 right-0 z-50 ${colors.bg} ${colors.border} border-b backdrop-blur-sm bg-black/80`}>
                <div className="flex justify-between items-center px-6 py-4">
                    {/* ... (your logo and other header items remain the same) ... */}
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
                        
                        {/* --- CORRECT AUTHENTICATION UI --- */}
                        {isLoggedIn && user ? (
                            <div className="flex items-center gap-3">
                                <span className={`text-sm ${colors.textSecondary}`}>{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${colors.buttonSecondary} rounded-lg transition-all duration-200 hover:scale-105`}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={openLoginModal}
                                    className={`px-4 py-2 text-sm font-medium ${colors.text} hover:${colors.textMuted} transition-all duration-200 hover:scale-105`}
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={openSignUpModal}
                                    className={`px-6 py-2 ${colors.buttonPrimary} text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg transform`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODALS WITH CORRECTED STATE --- */}

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals}></div>
                        <motion.div 
                             initial={{ y: -50, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             exit={{ y: 50, opacity: 0 }}
                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
                             className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4"
                        >
                            <button onClick={closeModals} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <X size={20} />
                            </button>
                            <div className="p-8 pb-6">
                                {/* ... Header ... */}
                                 <form className="space-y-6" onSubmit={onLogin}>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg">
                                        Sign In
                                    </button>
                                </form>
                                {/* ... Footer to switch to Sign Up ... */}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sign Up Modal */}
            <AnimatePresence>
                {showSignUpModal && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                    >
                         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals}></div>
                         <motion.div 
                             initial={{ y: -50, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             exit={{ y: 50, opacity: 0 }}
                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
                             className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4"
                         >
                            <button onClick={closeModals} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <X size={20} />
                            </button>
                            <div className="p-8 pb-6">
                                {/* ... Header ... */}
                                <form className="space-y-6" onSubmit={onSignup}>
                                     <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={fullname}
                                            onChange={(e) => setFullname(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={signUpEmail}
                                            onChange={(e) => setSignUpEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={signUpPassword}
                                            onChange={(e) => setSignUpPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {/* ... I have omitted the confirm password field for brevity, you can add it back ... */}
                                    <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg">
                                        Create Account
                                    </button>
                                </form>
                                {/* ... Footer to switch to Sign In ... */}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};