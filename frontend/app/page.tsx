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

      {/* GLOBAL TELEMETRY OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-[pulse_3s_infinite]" style={{ top: '15%' }}></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-[pulse_4s_infinite]" style={{ top: '45%' }}></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-[pulse_5s_infinite]" style={{ top: '75%' }}></div>
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

          {/* HOLOGRAPHIC SHIELD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
            <div className="mb-8 flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full animate-bounce">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[.4em] text-white">Neural Uplink Active</span>
            </div>

            <h1 className="text-6xl md:text-[120px] leading-[0.9] font-black tracking-tighter mb-8 drop-shadow-[0_20px_80px_rgba(16,185,129,0.3)]">
              SCAN. EXPLORE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white">DISCOVER ALL.</span>
            </h1>

            <p className="text-lg md:text-2xl text-white/50 font-bold max-w-2xl mb-12 drop-shadow-md">
              The first neural travel operating system. Synchronize your DNA with the world's most exclusive nodes.
            </p>

            <div className="flex flex-col md:flex-row gap-6">
              <Link href="/hotels"
                className="bg-emerald-500 text-black px-12 py-5 rounded-[22px] font-black tracking-widest hover:scale-110 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center gap-3">
                INITIATE SCAN <ArrowRight size={20} />
              </Link>
              <button className="bg-white/5 backdrop-blur-2xl border border-white/10 text-white px-12 py-5 rounded-[22px] font-black tracking-widest hover:bg-white/10 transition-all">
                VIEW NODES
              </button>
            </div>
          </div>
        </div>

        {/* EXPLORER OS MESH SECTION */}
        <div className="w-full px-8 md:px-20 py-32 bg-[#050505] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-12 text-center mb-20">
              <p className="text-emerald-500 font-black text-[10px] tracking-[0.8em] uppercase mb-4">Core Architecture</p>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8">Synchronized <span className="text-white/20">Discovery.</span></h2>
            </div>

            {/* FEATURE CARDS */}
            <div className="lg:col-span-4 group p-10 rounded-[3rem] bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <Globe size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4">Global Network</h3>
              <p className="text-white/40 font-bold leading-relaxed">Integrated 12,000+ nodes across 142 sectors for seamless navigation.</p>
              <div className="h-1 w-0 group-hover:w-full bg-emerald-500 mt-8 transition-all duration-700"></div>
            </div>

            <div className="lg:col-span-4 group p-10 rounded-[3rem] bg-emerald-500 border border-emerald-500 transition-all duration-700 hover:-translate-y-4 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
              <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-emerald-500 mb-8">
                <Zap size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-black">Instant Link</h3>
              <p className="text-black/60 font-bold leading-relaxed">Zero-latency established connections between your profile and every node.</p>
              <div className="h-1 w-full bg-black/10 mt-8"></div>
            </div>

            <div className="lg:col-span-4 group p-10 rounded-[3rem] bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-white">Neural Insights</h3>
              <p className="text-white/40 font-bold leading-relaxed">Advanced RAG algorithms matching your DNA with perfect gastronomy nodes.</p>
              <div className="h-1 w-0 group-hover:w-full bg-emerald-500 mt-8 transition-all duration-700"></div>
            </div>
          </div>
        </div>

        {/* VOYAGE SECTION UPGRADE */}
        <div className="w-full px-4 md:px-10 py-10">
          <div className="relative w-full py-40 flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] rounded-[4rem] border border-white/5 shadow-3xl">
            {/* Background Vertical Strips */}
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="grid grid-cols-6 h-full w-full gap-2 px-2">
                {[...(data?.hotels || []), ...(data?.activities || [])].slice(0, 6).map((item: any, i: number) => (
                  <div key={i} className="h-full w-full overflow-hidden rounded-2xl border border-white/5 relative group/strip">
                    <img
                      src={item.img || item.image_url}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover/strip:opacity-100 group-hover/strip:grayscale-0 transition-all duration-1000"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 text-center px-6">
              <Sparkles className="mx-auto text-emerald-500 mb-8 animate-spin-slow" size={48} />
              <h2 className="text-7xl md:text-[140px] font-black tracking-tighter leading-none mb-10">VOYAGE<span className="text-emerald-500">.</span></h2>
              <p className="text-xl md:text-3xl font-black text-white/30 uppercase tracking-[1em] mb-12">The Next Epoch</p>
              <Link href="/activities" className="bg-white text-black px-16 py-6 rounded-[2.5rem] font-black tracking-widest hover:scale-110 hover:rotate-1 transition-all shadow-2xl inline-block text-xl uppercase">
                Launch Expedition
              </Link>
            </div>
          </div>
        </div>

        {/* DISCOVERY GRID NODES */}
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-32 w-full">
          <div className="flex justify-between items-end mb-20">
            <div>
              <p className="text-emerald-500 font-black text-[10px] tracking-[0.8em] uppercase mb-4">Neural High-Match</p>
              <h2 className="text-6xl font-black tracking-tighter">Recommended <span className="text-white/20">Nodes.</span></h2>
            </div>
            <Link href="/hotels" className="text-white/40 font-black uppercase tracking-widest flex items-center gap-4 hover:text-emerald-500 transition-colors">
              View Network <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="bg-[#0A0A0A] rounded-[3rem] aspect-[3/4] animate-pulse"></div>)
            ) : (
              data.hotels?.slice(0, 3).map((h: any, i: number) => (
                <Link href={`/hotels/${h.id}`} key={i} className="group relative rounded-[3rem] overflow-hidden aspect-[4/5] bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-4">
                  <img src={h.img} alt={h.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-emerald-400 font-black text-[10px] tracking-widest uppercase mb-2">HOTEL NODE</p>
                    <h3 className="text-3xl font-extrabold tracking-tighter mb-4 line-clamp-1">{h.title}</h3>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <span className="text-white/40 font-black uppercase tracking-widest text-[10px]">Access Signal</span>
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]">
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
