"use client";
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { Activity, LayoutGrid, Compass, Utensils, Home as HomeIcon, LogOut, User } from 'lucide-react';

export default function Navbar({ className = "fixed" }: { className?: string }) {
    const { user, logout } = useAuth();

    return (
        <nav className={`${className} top-6 left-1/2 -translate-x-1/2 w-full max-w-6xl z-[100] px-4`}>
            <div className="bg-[#121212]/40 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10 rounded-full px-8 py-3 md:py-5 flex items-center justify-between group">
                <Link href="/" className="flex items-center gap-3 group/logo transition-all hover:scale-105">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover/logo:bg-emerald-500 transition-colors">
                        <Activity size={20} className="text-emerald-400 group-hover/logo:text-black" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Travello</span>
                </Link>

                {/* Desktop Menu - Explorer HUD Style */}
                <div className="hidden lg:flex items-center gap-8 font-black text-[10px] text-white/40 uppercase tracking-[.2em]">
                    <Link href="/" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav px-3 py-1.5 rounded-xl hover:bg-white/5">
                        <HomeIcon size={14} className="opacity-40 group-hover/nav:opacity-100" />
                        Home
                    </Link>
                    <Link href="/hotels" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav px-3 py-1.5 rounded-xl hover:bg-white/5">
                        <LayoutGrid size={14} className="opacity-40 group-hover/nav:opacity-100" />
                        Hotels
                    </Link>
                    <Link href="/restaurants" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav px-3 py-1.5 rounded-xl hover:bg-white/5">
                        <Utensils size={14} className="opacity-40 group-hover/nav:opacity-100" />
                        Dining
                    </Link>
                    <Link href="/activities" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav px-3 py-1.5 rounded-xl hover:bg-white/5">
                        <Compass size={14} className="opacity-40 group-hover/nav:opacity-100" />
                        Experiences
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-6">
                            <Link href="/profile" className="flex flex-col items-end hidden md:flex group cursor-pointer border-r border-white/10 pr-6">
                                <span className="text-[8px] uppercase font-black text-emerald-500 tracking-[0.4em] leading-none mb-1.5">Authorized User</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-white/50 group-hover:text-white transition-colors uppercase tracking-widest">{user.email.split('@')[0]}</span>
                                    <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/50 transition-all">
                                        <User size={12} className="text-white/40 group-hover:text-emerald-500" />
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 px-6 py-3 rounded-full text-[10px] font-black tracking-[.2em] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.1)] active:scale-95"
                            >
                                <LogOut size={14} /> EXIT
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link href="/signup" className="hidden md:block font-black text-white/30 hover:text-white transition-all text-[10px] uppercase tracking-[.2em]">
                                INITIALIZE ID
                            </Link>
                            <Link href="/login" className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-full text-[10px] font-black tracking-[.2em] transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase">
                                SIGN IN
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
