"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import {
    Search, Star, Rocket, MapPin,
    ArrowRight, Activity as ActivityIcon, BrainCircuit, Fingerprint,
    Zap, Compass, LayoutGrid, Timer
} from 'lucide-react';

export default function ActivitiesPage() {
    const [data, setData] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [minRating, setMinRating] = useState('0');
    const [maxPrice, setMaxPrice] = useState('5000');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/activities?search=${search}&minRating=${minRating}&maxPrice=${maxPrice}`)
            .then(res => res.json())
            .then(d => {
                if (Array.isArray(d)) setData(d);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, [search, minRating, maxPrice]);

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-emerald-500 selection:text-white pb-32 overflow-hidden">
            <Navbar className="fixed !bg-transparent backdrop-blur-3xl z-[100]" />

            {/* HOLOGRAPHIC HEADER */}
            <div className="relative pt-40 pb-20 px-8 md:px-16 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -mt-48"></div>

                <div className="relative z-10 max-w-7xl">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 tracking-[.4em] uppercase underline decoration-2 underline-offset-4">
                            Expedition Network
                        </span>
                        <div className="text-sm font-black text-white/20 tracking-widest uppercase flex items-center gap-2">
                            <ActivityIcon size={14} className="text-emerald-500" />
                            {data.length} Missions active
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-12 drop-shadow-2xl">
                        Thrilling <span className="text-emerald-500">Missions.</span>
                    </h1>

                    {/* HOLOGRAPHIC FILTERS */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/5 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/10 shadow-2xl">
                        <div className="md:col-span-6 group relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-500">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Scan for specific missions (e.g. Surfing)..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 focus:border-emerald-500/50 rounded-3xl py-6 pl-16 pr-8 text-sm font-black tracking-wide text-white outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                        <div className="md:col-span-3 group relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-500">
                                <Star size={20} />
                            </div>
                            <input
                                type="number"
                                min="0" max="5"
                                placeholder="Min DNA Score"
                                value={minRating}
                                onChange={e => setMinRating(e.target.value)}
                                className="w-full bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 focus:border-emerald-500/50 rounded-3xl py-6 pl-16 pr-8 text-sm font-black tracking-wide text-white outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                        <div className="md:col-span-3 group relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-500">
                                <Zap size={20} />
                            </div>
                            <input
                                type="number"
                                placeholder="Energy Cost (MAD)"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                className="w-full bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 focus:border-emerald-500/50 rounded-3xl py-6 pl-16 pr-8 text-sm font-black tracking-wide text-white outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* NODE GRID */}
            <div className="max-w-[1800px] mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-[#121212] rounded-[3rem] aspect-[3/4] animate-pulse border border-white/5"></div>
                    ))
                ) : (
                    data.map((a: any, i) => {
                        let imageUrl = a?.image_url || 'https://placehold.co/800x1200/0a0a0a/10b981?text=Neural+Link+Lost';
                        if (imageUrl.includes('cdn.getyourguide.com')) {
                            imageUrl = imageUrl.replace(/\/\d+\.jpg$/, '/88.jpg');
                        }

                        const price = a?.price || '0';
                        const rating = a?.score || 'N/A';
                        const name = a?.title || 'Unknown Mission';
                        const duration = a?.duration || 'Experience';

                        return (
                            <Link
                                href={`/activities/${a?.id}`}
                                key={i}
                                className="group relative rounded-[3rem] overflow-hidden flex flex-col aspect-[4/5] hover:-translate-y-4 transition-all duration-700 shadow-2xl border border-white/5 hover:border-emerald-500/30 block bg-[#121212]"
                            >
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    className="absolute inset-0 w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>

                                {/* Hover Elements */}
                                <div className="absolute top-8 right-8 bg-white text-black px-6 py-2 rounded-2xl font-black text-xs shadow-2xl tracking-widest translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    {price} MAD
                                </div>

                                <div className="absolute top-8 left-8 flex flex-col gap-2">
                                    <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-xl font-black text-emerald-400 text-[10px] flex items-center gap-2 whitespace-nowrap">
                                        <Star size={12} fill="currentColor" />
                                        DNA: {rating}
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-black text-white/50 text-[10px] uppercase tracking-widest block opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                                        <Timer size={10} /> {duration}
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-10 text-white flex flex-col justify-end">
                                    <div className="mb-4 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-emerald-400 mb-2">Adventure Node</p>
                                        <h3 className="font-extrabold text-3xl mb-4 leading-tight tracking-tighter line-clamp-2 drop-shadow-2xl">{name}</h3>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-emerald-500 transition-colors">
                                        <span>Deploy Expedition</span>
                                        <ArrowRight size={16} />
                                    </div>

                                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-0 group-hover:w-full transition-all duration-[1.5s] ease-out shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
            {!loading && data.length === 0 && (
                <div className="col-span-full text-center py-40">
                    <Compass size={80} className="mx-auto text-emerald-500/20 mb-8 animate-pulse" />
                    <p className="text-2xl font-black text-white/30 uppercase tracking-[.5em]">No compatible missions found.</p>
                    <button onClick={() => { setSearch(''); setMinRating('0'); setMaxPrice('5000'); }} className="mt-8 text-emerald-500 font-bold border-b border-emerald-500 pb-1">Reset Expedition Filters</button>
                </div>
            )}
        </div>
    );
}
