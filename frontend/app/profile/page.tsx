"use client";

import { useAuth } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import {
    User as UserIcon, Mail, Shield, MapPin, Compass, Wallet,
    LogOut, Edit3, Camera, History, Sparkles, LayoutDashboard,
    Settings, Bell, Search, Menu, X, ChevronRight, Star, Heart,
    Globe, CameraIcon, Utensils, Mountain, Tent, Zap, BrainCircuit,
    Save, Sliders, Check, Info, ArrowUpRight, MessageCircle, Send,
    Bot, Loader2, Award, ZapOff, Fingerprint, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function ProfileDashboard() {
    const { user, loading, logout, token } = useAuth();
    const router = useRouter();

    // Core AI Data
    const [persona, setPersona] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isPredicting, setIsPredicting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // AI Chat System
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        adventure_score: 50,
        foodie_score: 50,
        culture_score: 50,
        budget_index: 0.5
    });

    useEffect(() => {
        if (!loading && !user) router.push("/login");
        if (user && token && !persona) {
            fetchIntelligence();
            setFormData({
                adventure_score: user.adventure_score || 50,
                foodie_score: user.foodie_score || 50,
                culture_score: user.culture_score || 50,
                budget_index: user.budget_index || 0.5
            });
            // Initial AI greeting
            setMessages([{
                id: 1, role: 'ai',
                text: `Sbah l-khir ${user.email.split('@')[0]}! I've loaded your ${user?.adventure_score && user.adventure_score > 70 ? 'adventurous' : 'refined'} traveler DNA. Ready to scan the Agadir region?`
            }]);
        }
    }, [user, loading, router, token]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchIntelligence = async () => {
        setIsPredicting(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        try {
            const [pRes, rRes] = await Promise.all([
                fetch(`${API_URL}/api/predict/segmentation`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/api/recommendations`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (pRes.ok) {
                const pData = await pRes.json();
                setPersona(pData?.persona);
            }
            if (rRes.ok) {
                const rData = await rRes.json();
                setRecommendations(rData.recommendations || []);
            }
        } catch (err) {
            console.error("AI Sync Error:", err);
        } finally {
            setIsPredicting(false);
        }
    }

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;
        const msg = chatMessage;
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: msg }]);
        setChatMessage("");
        setIsAiTyping(true);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        try {
            const res = await fetch(`${API_URL}/api/ai/chat?message=${encodeURIComponent(msg)}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.reply }]);
            }
        } finally {
            setIsAiTyping(false);
        }
    }

    const formatMessage = (text: string) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-2'}>
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-emerald-400 font-black">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const BentoItem = ({ children, className, delay = 0, noPadding = false, onClick }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-[#121212] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden group ${!noPadding ? 'p-10' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-emerald-500 selection:text-white pb-32">

            <Navbar className="fixed !bg-transparent backdrop-blur-3xl z-[100]" />

            <main className="max-w-[1600px] mx-auto p-6 md:p-12 pt-32 lg:pt-44">

                {/* SYSTEM HEADER */}
                <header className="mb-20 px-6 flex flex-col md:flex-row justify-between items-end gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 tracking-[.3em] uppercase">
                                System v2.5 Online
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                            Explorer<span className="text-emerald-500">.</span>os
                        </h1>
                        <p className="text-xl text-neutral-400 font-medium max-w-xl">
                            Biometric traveler ID: <span className="text-white italic underline underline-offset-8 decoration-emerald-500/30">{user.email.split('@')[0]}</span>. Core DNA sync active with Gemini-Neural.
                        </p>
                    </div>
                </header>

                {/* BENTO GRID SYSTEM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:auto-rows-[minmax(200px,auto)]">

                    {/* PERSONA IDENTIFIER (Large) */}
                    <BentoItem className="lg:col-span-8 lg:row-span-2 relative min-h-[500px] flex flex-col justify-end" noPadding>
                        <div className="absolute inset-0 grayscale-[40%] hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100">
                            <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Explorer Mask" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent"></div>

                        <div className="relative z-10 p-12 lg:p-16">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex items-center gap-4 mb-8"
                            >
                                <Award className="text-emerald-400" size={32} />
                                <span className="text-sm font-black tracking-[.4em] uppercase text-emerald-400">Predictive Metadata</span>
                            </motion.div>

                            <h3 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                                {persona?.name || "Initializing..."}
                            </h3>
                            <p className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mb-12 leading-relaxed italic border-l-2 border-emerald-500/30 pl-8">
                                "{persona?.description || "Computing interaction nodes to establish traveler segmentation..."}"
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-12 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                                >
                                    <Fingerprint size={18} />
                                    SYNC DNA
                                </button>
                            </div>
                        </div>
                    </BentoItem>

                    {/* BIOMETRIC STATS */}
                    <BentoItem className="lg:col-span-4 lg:row-span-2 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-12">
                            <h4 className="text-2xl font-black tracking-tight">Biometrics</h4>
                            <Activity className="text-emerald-500" size={24} />
                        </div>

                        <div className="space-y-10">
                            {[
                                { icon: Mountain, label: "Adventure", score: user.adventure_score || 50, color: "text-orange-500" },
                                { icon: Utensils, label: "Foodie", score: user.foodie_score || 50, color: "text-emerald-500" },
                                { icon: Heart, label: "Cultural", score: user.culture_score || 50, color: "text-red-500" },
                                { icon: Wallet, label: "Budget", score: Math.round((user.budget_index || 0.5) * 100), color: "text-blue-500" }
                            ].map((stat, i) => (
                                <div key={i} className="group cursor-crosshair">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <stat.icon size={16} className={stat.color} />
                                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                        <span className="text-xs font-black font-mono text-emerald-400">{stat.score}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.score}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full bg-current ${stat.color} opacity-80 shadow-[0_0_15px_rgba(16,185,129,0.3)]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-neutral-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                LIVE TRACKING ACTIVE
                            </div>
                        </div>
                    </BentoItem>

                    {/* SUGGESTED JOURNEYS (Medium) */}
                    <BentoItem className="lg:col-span-12 lg:row-span-2">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                            <div>
                                <h4 className="text-4xl font-black tracking-tighter mb-2">Suggested Nodes</h4>
                                <p className="text-sm text-neutral-500 font-medium">Predicted destinations based on your current persona.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-white/50 uppercase">Agadir Region</div>
                                <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-widest text-emerald-400 uppercase">Top 10 Matches</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                            {recommendations.slice(0, 4).map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="bg-[#1A1A1A] rounded-[2.5rem] p-4 border border-white/5 group relative cursor-pointer h-full flex flex-col"
                                >
                                    <div className="h-56 rounded-[2rem] overflow-hidden mb-8 relative">
                                        <img src={item.image_url || "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-3xl text-[9px] font-black text-emerald-400 border border-white/10">
                                            {item.category || "ACTIVITY"}
                                        </div>
                                    </div>
                                    <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h5 className="text-xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.title}</h5>
                                            <div className="flex items-center gap-4 text-xs font-bold text-neutral-500 mb-8">
                                                <span className="flex items-center gap-2"><MapPin size={14} /> 2.5km</span>
                                                <span className="flex items-center gap-2"><Star size={14} className="text-yellow-500" /> 4.9</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
                                            <span className="text-2xl font-black text-white">{item.price} <span className="text-[10px] text-neutral-500">MAD</span></span>
                                            <ArrowUpRight size={24} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </BentoItem>

                    {/* WORKING COMMAND CENTER (Neural Scout Only) */}
                    <BentoItem className="lg:col-span-12 lg:row-span-1 bg-[#132922] text-white border-none shadow-[0_20px_60px_rgba(19,41,34,0.4)] flex items-center justify-between relative overflow-hidden group p-12 cursor-pointer" onClick={() => setIsChatOpen(true)}>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 w-full">
                            <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                                <Bot size={48} className="animate-pulse text-emerald-400" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h5 className="text-3xl font-black tracking-tighter uppercase">Neural Scout Command</h5>
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-[9px] font-black text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">v1.5 Sync</div>
                                </div>
                                <p className="text-lg font-medium text-white/40 max-w-2xl leading-relaxed">Establish a quantum link with the Gemini RAG engine to discover hidden gems in Agadir.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden xl:block">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Status</div>
                                    <div className="text-sm font-bold text-white">Quantum Link Active</div>
                                </div>
                                <button className="px-12 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl">
                                    Launch Scout
                                </button>
                            </div>
                        </div>
                    </BentoItem>

                </div>
            </main>

            {/* SYNC MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6 lg:p-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#121212] w-full max-w-5xl h-full max-h-[900px] rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                        >
                            <div className="p-16 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-5xl font-black tracking-tighter mb-4">Neural Tuning</h2>
                                    <p className="text-neutral-500 font-medium tracking-tight">Adjust the biometric scores to recalibrate Gemini segmentation.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-16 space-y-20 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    {[
                                        { key: 'adventure_score', label: 'Adventure Spirit', icon: Mountain, desc: 'Wilderness & High Thrill' },
                                        { key: 'foodie_score', label: 'Cuisine Passion', icon: Utensils, desc: 'Gastronomy & Street Food' },
                                        { key: 'culture_score', label: 'Historic Nodes', icon: Heart, desc: 'Museums & Heritage' },
                                        { key: 'budget_index', label: 'Resource Flow', icon: Wallet, desc: 'Economy vs Luxury', step: 0.1, max: 1 }
                                    ].map((field: any) => (
                                        <div key={field.key} className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                                        <field.icon size={24} className="text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <h6 className="text-sm font-black tracking-widest uppercase">{field.label}</h6>
                                                        <p className="text-[10px] font-medium text-neutral-500 italic">{field.desc}</p>
                                                    </div>
                                                </div>
                                                <span className="text-3xl font-black text-emerald-400 font-mono">
                                                    {field.key === 'budget_index' ? (
                                                        (formData as any)[field.key] > 0.7 ? 'LUX' : (formData as any)[field.key] < 0.4 ? 'MIN' : 'MID'
                                                    ) : `${(formData as any)[field.key]}%`}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0" max={field.max || 100} step={field.step || 1}
                                                value={(formData as any)[field.key]}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: parseFloat(e.target.value) })}
                                                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-16 border-t border-white/5 bg-black/20 flex justify-end">
                                <button
                                    onClick={async () => {
                                        setIsPredicting(true);
                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                            body: JSON.stringify(formData)
                                        });
                                        if (res.ok) {
                                            setIsModalOpen(false);
                                            await fetchIntelligence();
                                            window.location.reload();
                                        }
                                        setIsPredicting(false);
                                    }}
                                    className="px-20 py-8 bg-emerald-500 text-black rounded-full font-black text-sm uppercase tracking-[.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.4)]"
                                >
                                    {isPredicting ? <Loader2 className="animate-spin mx-auto" /> : "Re-Calibrate DNA"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FLOATING HOLOGRAPHIC SIDEBAR CHAT */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-[#0A0A0A]/95 backdrop-blur-3xl z-[2000] border-l border-white/10 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] flex flex-col"
                    >
                        {/* Premium Header */}
                        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-black shadow-2xl shadow-emerald-500/40 relative">
                                    <Bot size={32} />
                                    <div className="absolute inset-0 rounded-[2rem] bg-emerald-400 blur-lg opacity-20 animate-pulse"></div>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black tracking-tight leading-none mb-2 underline decoration-emerald-500 decoration-2 underline-offset-4">Neural Scout</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                        Quantum Link Active
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Immersive Message Stream */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-gradient-to-b from-transparent to-emerald-500/5">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} group animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                    <div className={`max-w-[90%] relative ${m.role === 'ai' ? 'text-left' : 'text-right'}`}>
                                        <div className={`p-8 rounded-[2.5rem] tracking-tight text-[15px] font-medium leading-[1.8] transition-all whitespace-pre-line ${m.role === 'ai'
                                            ? 'bg-[#1A1A1A]/90 text-white border border-white/10 rounded-tl-none hover:border-emerald-500/30 shadow-2xl'
                                            : 'bg-emerald-500 text-black font-black rounded-tr-none shadow-[0_20px_40px_rgba(16,185,129,0.2)]'
                                            }`}>
                                            {m.role === 'ai' ? formatMessage(m.text) : m.text}
                                        </div>
                                        <div className={`mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-[.2em] px-2 ${m.role === 'ai' ? 'justify-start text-emerald-400' : 'justify-end text-white/30'}`}>
                                            {m.role === 'ai' ? <BrainCircuit size={10} /> : <Fingerprint size={10} />}
                                            {m.role === 'ai' ? 'Neural Synthesis' : 'Secure Core Input'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isAiTyping && (
                                <div className="flex justify-start">
                                    <div className="px-10 py-8 rounded-[2.5rem] bg-[#1A1A1A] border border-white/10 flex gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Command Input Area */}
                        <div className="p-10 bg-black/60 border-t border-white/10 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-[#0A0A0A] border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                Neural Interface Term
                            </div>
                            <div className="bg-white/5 rounded-[2.2rem] p-3 pl-8 flex items-center border border-white/10 focus-within:border-emerald-500/50 transition-all shadow-inner group">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Query the database..."
                                    className="flex-1 bg-transparent py-4 text-sm font-bold placeholder:text-neutral-700 outline-none text-white selection:bg-emerald-500/30"
                                />
                                <button onClick={handleSendMessage} className="w-14 h-14 bg-white text-black rounded-[1.5rem] flex items-center justify-center hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20"></div>
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="mt-8 flex justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">SSL Encrypted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Gemini Engine</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
