"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import {
  ArrowRight, Activity, BrainCircuit, Fingerprint,
  Map, Utensils, Home as HomeIcon, Zap, Globe, Sparkles
} from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<any>({ hotels: [], activities: [], restaurants: [] });
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/home-data')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] overflow-hidden font-sans relative selection:bg-emerald-500 selection:text-white">
      <Navbar className="fixed !bg-transparent backdrop-blur-3xl z-[100]" />

      {/* CLEAN BACKGROUND OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)]"></div>
      </div>

      <div className="w-full relative z-10 flex flex-col items-center">

        {/* CINEMATIC HERO */}
        <div className="relative w-full h-screen overflow-hidden group">
          <video
            autoPlay loop muted playsInline
            className="w-full h-full object-cover transition-all duration-[3000ms]"
            style={{ transform: `scale(${1 + scrollY * 0.0003})` }}
          >
            <source src="/make_this_video_202603181538.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/20 to-[#050505] z-10"></div>

          {/* SIMPLE TAG */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
            <div className="mb-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full">
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Discover Agadir</span>
            </div>

            <h1 className="text-6xl md:text-[100px] leading-[1] font-bold tracking-tight mb-8">
              Explore Agadir.<br />
              <span className="text-white/40">Like Never Before.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 font-medium max-w-xl mb-12">
              Your intelligent travel companion for the heart of Morocco. Personalized recommendations powered by AI.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/hotels"
                className="bg-emerald-500 text-black px-10 py-4 rounded-xl font-bold tracking-tight hover:bg-emerald-400 transition-all flex items-center gap-2">
                Start Exploring <ArrowRight size={18} />
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-xl font-bold tracking-tight hover:bg-white/20 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* EXPLORER OS MESH SECTION */}
        <div className="w-full px-8 md:px-20 py-32 bg-[#050505] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-12 text-center mb-20">
              <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-4">Smart Voyager</p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">Personalized <span className="text-white/30">Journeys.</span></h2>
            </div>

            {/* FEATURE CARDS */}
            <div className="lg:col-span-4 group p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 transition-transform group-hover:scale-110">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Local Curation</h3>
              <p className="text-white/40 text-base leading-relaxed">Expertly selected destinations and venues across Agadir and surrounding regions.</p>
            </div>

            <div className="lg:col-span-4 group p-10 rounded-3xl bg-emerald-500 text-black border border-emerald-500 transition-all duration-500 shadow-[0_32px_64px_-16px_rgba(16,185,129,0.3)] scale-105 active:scale-100 cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-emerald-500 mb-8">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Booking</h3>
              <p className="text-black/70 text-base leading-relaxed">Fast and secure access to hotels, restaurants, and guided activities in one place.</p>
            </div>

            <div className="lg:col-span-4 group p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 transition-transform group-hover:scale-110">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI Recommendations</h3>
              <p className="text-white/40 text-base leading-relaxed">Smart algorithms that learn your preferences to suggest the perfect trip.</p>
            </div>
          </div>
        </div>

        {/* VOYAGE SECTION UPGRADE */}
        <div className="w-full px-4 md:px-10 py-10">
          <div className="relative w-full py-40 flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] rounded-[3rem] border border-white/5 shadow-2xl">
            {/* Background Image Grid */}
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="grid grid-cols-6 h-full w-full gap-4 px-4 py-4">
                {[...(data?.hotels || []), ...(data?.activities || [])].slice(0, 6).map((item: any, i: number) => (
                  <div key={i} className="h-full w-full overflow-hidden rounded-2xl border border-white/5 relative group/strip">
                    <img
                      src={item.img || item.image_url}
                      className="w-full h-full object-cover transition-all duration-1000"
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 text-center px-6">
              <h2 className="text-7xl md:text-[100px] font-bold tracking-tight leading-none mb-6">VOYAGE<span className="text-emerald-500">.</span></h2>
              <p className="text-lg md:text-xl font-medium text-white/40 mb-12">Experience the future of personal travel</p>
              <Link href="/activities" className="bg-white text-black px-12 py-5 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl inline-block text-lg">
                Start Journey
              </Link>
            </div>
          </div>
        </div>

        {/* DISCOVERY GRID NODES */}
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-32 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div>
              <p className="text-emerald-500 font-bold text-[10px] tracking-widest uppercase mb-4">Top Rated Stays</p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Recommended <span className="text-white/20">Hotels.</span></h2>
            </div>
            <Link href="/hotels" className="text-white/40 font-bold uppercase tracking-widest text-xs flex items-center gap-4 hover:text-emerald-500 transition-colors group">
              View All Stays <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="bg-[#0A0A0A] rounded-3xl aspect-[3/4] animate-pulse"></div>)
            ) : (
              data.hotels?.slice(0, 3).map((h: any, i: number) => (
                <Link href={`/hotels/${h.id}`} key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-4">
                  <img src={h.img} alt={h.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-emerald-500 font-bold text-[10px] tracking-widest uppercase mb-2">Featured Hotel</p>
                    <h3 className="text-3xl font-bold tracking-tight mb-4 line-clamp-1">{h.title}</h3>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">View Details</span>
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
