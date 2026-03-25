"use client";
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { Activity, LayoutGrid, Compass, Utensils, Home as HomeIcon, LogOut, User } from 'lucide-react';

export default function Navbar({ className = "fixed" }: { className?: string }) {
    const { user, logout } = useAuth();

    return (
        <nav className={`${className} top-6 left-1/2 -translate-x-1/2 w-full max-w-6xl z-[100] px-4`}>
            <div className="bg-[#121212]/40 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10 rounded-full px-8 py-3 md:py-5 flex items-center justify-between group">
                <Link href="/" className="flex items-center gap-3 transition-all hover:scale-105 group/logo">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover/logo:shadow-emerald-500/50">
                        <Activity size={22} className="text-black" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-emerald-500 italic">Travello</span>
                </Link>

                <div className="hidden lg:flex items-center gap-10 font-bold text-[11px] text-white/40 tracking-widest uppercase">
                    <Link href="/" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav">
                        Home
                    </Link>
                    <Link href="/hotels" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav relative">
                        Hotels
                        <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-500 transition-all group-hover/nav:w-full"></div>
                    </Link>
                    <Link href="/restaurants" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav relative">
                        Dining
                        <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-500 transition-all group-hover/nav:w-full"></div>
                    </Link>
                    <Link href="/activities" className="hover:text-emerald-500 transition-all flex items-center gap-2 group/nav relative">
                        Activities
                        <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-500 transition-all group-hover/nav:w-full"></div>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-6">
                            <Link href="/profile" className="flex items-center gap-3 hidden md:flex group cursor-pointer border-r border-white/10 pr-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-white/40 leading-none">Account</p>
                                    <p className="text-xs font-bold text-white tracking-tight">{user.email.split('@')[0]}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
                                    <User size={14} className="text-white/40 group-hover:text-emerald-500" />
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
                            <Link href="/signup" className="hidden md:block font-black text-white/40 hover:text-white transition-all text-[11px] tracking-widest uppercase">
                                Join
                            </Link>
                            <Link href="/login" className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-full font-black transition-all shadow-lg text-xs uppercase tracking-widest hover:scale-105 active:scale-95">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
