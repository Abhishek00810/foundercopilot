'use client';

import { useSearchParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
    LayoutDashboard, UserSearch, Bot, Settings, ChevronDown, Sun, Moon,
    Briefcase, Feather, Rocket, Type, User, MessageSquare, Copy, RefreshCw, 
    Linkedin, Twitter, Check, Award, DollarSign, BrainCircuit
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// --- TYPE DEFINITIONS ---
interface FounderData {
  name: string;
  title?: string;
  linkedin?: string;
  twitter?: string;
  photo?: string;
  bio?: string;
  company: {
    name: string;
    funding: string;
    achievements: string[];
  };
}

const goals = [
  { value: 'Remote job request', icon: <Briefcase size={16} /> },
  { value: 'Freelance collaboration', icon: <Feather size={16} /> },
  { value: 'Pitch a startup idea', icon: <Rocket size={16} /> },
  { value: 'Custom', icon: <Type size={16} /> },
];

const tones = ["Professional", "Enthusiastic", "Concise", "Formal"];


// --- THEME PROVIDER ---
type Theme = "dark" | "light" | "system";
const ThemeProviderContext = createContext<{ 
  theme: Theme, 
  setTheme: (theme: Theme) => void 
} | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
        // Default to dark if no theme is stored
        setThemeState("dark");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = { theme, setTheme: setThemeState };
  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};

const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

// --- HELPER & UI COMPONENTS ---
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};


const NavItem = ({ icon, text, isExpanded }: { icon: React.ReactNode, text: string, isExpanded: boolean }) => (
    <a href="#" className="flex items-center gap-4 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200 font-medium">
        {icon}
        <AnimatePresence>
            {isExpanded && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="whitespace-nowrap"
                >
                    {text}
                </motion.span>
            )}
        </AnimatePresence>
    </a>
);

const NavBar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <motion.nav
            onHoverStart={() => setIsExpanded(true)}
            onHoverEnd={() => setIsExpanded(false)}
            className="fixed top-0 left-0 h-full z-50 flex flex-col p-3 bg-card border-r border-border"
            animate={{ width: isExpanded ? 256 : 80 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
            <div className="flex-shrink-0 px-2 py-4">
                 <BrainCircuit size={32} className="text-primary" />
            </div>
            <div className="flex-grow flex flex-col gap-1 mt-8">
                <NavItem icon={<LayoutDashboard size={22} />} text="Dashboard" isExpanded={isExpanded} />
                <NavItem icon={<UserSearch size={22} />} text="Founder Search" isExpanded={isExpanded} />
                <NavItem icon={<Bot size={22} />} text="AI Assistant" isExpanded={isExpanded} />
            </div>
            <div className="flex-shrink-0 flex flex-col gap-1">
                <NavItem icon={<Settings size={22} />} text="Settings" isExpanded={isExpanded} />
                <div className={`flex justify-center py-2 ${isExpanded ? 'items-end' : ''}`}>
                   <ThemeToggle />
                </div>
            </div>
        </motion.nav>
    );
};

const CustomDropdown = ({ selected, setSelected, options, label }: { selected: any, setSelected: (value: any) => void, options: any[], label: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === selected);
    
    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-11 flex items-center justify-between px-3 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            >
                <div className="flex items-center gap-3">
                    {selectedOption?.icon}
                    <span>{selectedOption?.value}</span>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={20} />
                </motion.div>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute w-full mt-2 bg-popover border border-border rounded-md z-10 overflow-hidden shadow-lg"
                    >
                        {options.map(option => (
                            <li
                                key={option.value}
                                onClick={() => { setSelected(option.value); setIsOpen(false); }}
                                className="flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-accent"
                            >
                                {option.icon}
                                {option.value}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

const InputField = ({ label, value, onChange, placeholder }: {label:string, value:string, onChange:(e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?:string}) => (
    <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            className="w-full h-11 px-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }: {label:string, value:string, onChange:(e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]}) => (
    <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
        <select 
            value={value} 
            onChange={onChange}
            className="w-full h-11 px-3 bg-background border border-border rounded-md appearance-none focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
        >
            {options.map(t => <option key={t} className="bg-popover text-popover-foreground">{t}</option>)}
        </select>
    </div>
);


// --- MAIN PAGE COMPONENT ---
function FounderPageContent() {
  const searchParams = useSearchParams();
  const companyQuery = searchParams.get('company') || 'Notion';
  
  const [isLoading, setIsLoading] = useState(true);
  const [founder, setFounder] = useState<FounderData | null>(null);
  const [coldEmail, setColdEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  
  const [goal, setGoal] = useState('Remote job request');
  const [customGoal, setCustomGoal] = useState('');
  const [userRole, setUserRole] = useState('Senior Machine Learning Engineer');
  const [emailTone, setEmailTone] = useState('Professional');

  const pageControls = useAnimation();
  const mainControls = useAnimation();
  
  const generateContent = useCallback(async (currentFounder: FounderData) => {
    setIsGenerating(true);
    setColdEmail('');

    const currentGoal = goal === 'Custom' ? customGoal : goal;
    const prompt = `...`; // Prompt logic remains the same
    
    await new Promise(res => setTimeout(res, 1500));
    const mockEmail = `Subject: Admiration for Notion's recent milestone & a proposition

Dear ${currentFounder.name},

I was incredibly impressed to read about ${currentFounder.company.achievements[0]}. It’s a testament to Notion's visionary leadership and innovative culture.

As a ${userRole} with a passion for building intelligent systems, my goal is to ${currentGoal.toLowerCase()}. I've been following Notion's journey and believe my expertise in [mention a specific skill, e.g., large-scale data processing] could significantly support your mission.

Would you be open to a brief 15-minute conversation next week to explore a potential synergy?

Best regards,

[Your Name]
[Your Portfolio Link]`;
    
    setColdEmail(mockEmail);
    setIsGenerating(false);
  }, [goal, customGoal, userRole, emailTone]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 1000));
      const mockFounder: FounderData = {
          name: 'Ivan Zhao',
          title: 'Co-founder & CEO',
          linkedin: 'https://www.linkedin.com/in/ivanzhao/',
          twitter: 'https://twitter.com/ivzhao',
          photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto=format&fit=crop',
          bio: 'Ivan Zhao is the visionary mind behind Notion, the all-in-one workspace redefining productivity. His focus on elegant design and powerful functionality drives the company\'s mission to make software toolmaking ubiquitous.',
          company: {
              name: 'Notion',
              funding: 'Series C - $275M',
              achievements: ["Reached a $10 billion valuation", "Launched Notion AI to widespread acclaim", "Named one of Fast Company's Most Innovative Companies"],
          }
      };
      setFounder(mockFounder);
      setIsLoading(false);
      
      pageControls.start("visible");
      mainControls.start("visible");
      generateContent(mockFounder);
    };
    fetchData();
  }, [companyQuery, pageControls, mainControls, generateContent]);

  useEffect(() => {
    if (founder && !isLoading) {
      generateContent(founder);
    }
  }, [goal, customGoal, emailTone, userRole, founder, generateContent, isLoading]);

  if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                  <Bot size={48} className="mx-auto text-primary animate-pulse" />
                  <h1 className="mt-4 text-2xl font-bold">Preparing Intelligence Report...</h1>
                  <p className="text-muted-foreground">Please wait a moment.</p>
              </div>
          </div>
      );
  }

  return (
    <div className={`min-h-screen w-full bg-background text-foreground ${inter.variable} font-sans flex overflow-hidden`}>
        <NavBar />
        
        <main className="flex-grow ml-[80px] p-4 sm:p-6 md:p-8 z-10 w-full overflow-y-auto">
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } } }}
                initial="hidden"
                animate={pageControls}
            >
                <motion.div variants={{hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 }}}>
                    <CustomDropdown selected={goal} setSelected={setGoal} options={goals} label="Your Goal" />
                </motion.div>
                
                <AnimatePresence>
                    {goal === 'Custom' && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="md:col-span-1"
                        >
                            <InputField label="Custom Goal" value={customGoal} onChange={e => setCustomGoal(e.target.value)} placeholder="e.g., Seeking mentorship" />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <motion.div variants={{hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 }}}>
                    <InputField label="Your Role" value={userRole} onChange={e => setUserRole(e.target.value)} />
                </motion.div>
                
                <motion.div variants={{hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 }}}>
                     <SelectField label="Email Tone" value={emailTone} onChange={e => setEmailTone(e.target.value)} options={tones} />
                </motion.div>
            </motion.div>

            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-5 gap-8"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }}}
                initial="hidden"
                animate={mainControls}
            >
                {/* --- Founder Panel --- */}
                <motion.div className="lg:col-span-2 p-6 bg-card rounded-lg border border-border shadow-sm" variants={{hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 }}}>
                    <div className="text-center">
                        <img src={founder?.photo} alt={founder?.name} className="w-28 h-28 rounded-full mx-auto ring-4 ring-primary/20 object-cover"/>
                        <h1 className="text-2xl font-bold mt-4 text-card-foreground">{founder?.name}</h1>
                        <p className="text-primary font-medium">{founder?.title}</p>
                        <div className="flex justify-center gap-3 mt-4">
                            <a href={founder?.linkedin} target="_blank" rel="noreferrer" className="p-2 text-muted-foreground bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"><Linkedin size={18}/></a>
                            <a href={founder?.twitter} target="_blank" rel="noreferrer" className="p-2 text-muted-foreground bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"><Twitter size={18}/></a>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-6 text-center leading-relaxed">{founder?.bio}</p>
                    <div className="mt-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg"><DollarSign size={20} className="text-primary"/></div>
                            <div>
                                <h4 className="font-semibold text-card-foreground">Funding</h4>
                                <p className="text-sm text-muted-foreground">{founder?.company.funding}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                             <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg"><Award size={20} className="text-primary"/></div>
                            <div>
                                <h4 className="font-semibold text-card-foreground">Key Achievements</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                                    {founder?.company.achievements.map(ach => <li key={ach}>{ach}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- Email Panel --- */}
                <motion.div className="lg:col-span-3 p-6 bg-card rounded-lg border border-border shadow-sm flex flex-col" variants={{hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 }}}>
                    <h3 className="text-lg font-bold text-primary mb-4">AI-Generated Email</h3>
                    <div className="flex-grow p-4 bg-background rounded-md border border-input min-h-[300px] text-sm leading-relaxed whitespace-pre-wrap selection:bg-primary/20" contentEditable={!isGenerating} suppressContentEditableWarning={true}>
                        {isGenerating ? (
                             <div className="flex items-center justify-center h-full text-muted-foreground gap-2 animate-pulse"><Bot size={18}/><span>Crafting message...</span></div>
                        ) : (coldEmail)}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                         <motion.button onClick={() => {setShowCopied(true); navigator.clipboard.writeText(coldEmail); setTimeout(() => setShowCopied(false), 2000)}} whileTap={{scale:0.97}} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-accent font-semibold rounded-md transition-colors text-sm h-10">
                            {showCopied ? <Check size={16}/> : <Copy size={16}/>}
                            {showCopied ? 'Copied!' : 'Copy Text'}
                         </motion.button>
                         <motion.button onClick={() => generateContent(founder!)} disabled={isGenerating} whileTap={{scale:0.97}} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm h-10">
                            <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''}/>
                            {isGenerating ? 'Regenerating...' : 'Regenerate'}
                         </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </main>
    </div>
  );
}

// Wrap the main export in the ThemeProvider
export default function FounderPage() {
    return (
        <ThemeProvider>
            <FounderPageContent />
        </ThemeProvider>
    );
}