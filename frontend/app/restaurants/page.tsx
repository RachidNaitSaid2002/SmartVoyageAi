"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import {
    Search, Star, Utensils, MapPin,
    ArrowRight, Activity, BrainCircuit, Fingerprint,
    Zap, Soup, LayoutGrid, Heart
} from 'lucide-react';

export default function RestaurantsPage() {
    const [data, setData] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [minRating, setMinRating] = useState('0');
    const [maxPrice, setMaxPrice] = useState('1000');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/restaurants?search=${search}&minRating=${minRating}&maxPrice=${maxPrice}`)
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
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -ml-48 -mt-48"></div>
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -mr-48"></div>

                <div className="relative z-10 max-w-7xl">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 tracking-widest uppercase">
                            Dining in Agadir
                        </span>
                        <div className="text-sm font-medium text-white/40 flex items-center gap-2">
                            {data.length} restaurants available
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-12">
                        Taste the finest <span className="text-emerald-500">Local Flavors.</span>
                    </h1>

                    {/* HOLOGRAPHIC FILTERS */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
                        <div className="md:col-span-6 relative">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 focus:border-emerald-500/50 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                        <div className="md:col-span-3 relative">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30">
                                <Star size={18} />
                            </div>
                            <input
                                type="number"
                                min="0" max="5"
                                placeholder="Min Rating"
                                value={minRating}
                                onChange={e => setMinRating(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 focus:border-emerald-500/50 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                        <div className="md:col-span-3 relative">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30">
                                <Zap size={18} />
                            </div>
                            <input
                                type="number"
                                placeholder="Price Level"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 focus:border-emerald-500/50 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* NODE GRID */}
            <div className="max-w-[1800px] mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-[#121212] rounded-3xl aspect-[3/4] animate-pulse border border-white/5"></div>
                    ))
                ) : (
                    data.map((r: any, i) => {
                        let imageUrl = r.image || 'https://placehold.co/800x1200/0a0a0a/10b981?text=Neural+Link+Lost';

                        const priceLevel = r?.priceRange || r?.priceLevel || 'MID';
                        const rating = r?.rating || 'N/A';
                        const name = r?.name || 'Unknown Node';
                        const cuisines = r?.cuisines || [];

                        return (
                            <Link
                                href={`/restaurants/${r?.id}`}
                                key={i}
                                className="group relative rounded-3xl overflow-hidden flex flex-col aspect-[4/5] hover:-translate-y-2 transition-all duration-500 bg-white/5 border border-white/10"
                            >
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                                <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-lg font-bold text-xs">
                                    {priceLevel}
                                </div>

                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg font-bold text-white text-[10px] flex items-center gap-1">
                                        <Star size={10} fill="currentColor" />
                                        {rating}
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col justify-end">
                                    <h3 className="font-bold text-xl mb-2 line-clamp-2">{name}</h3>
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>View Menu</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
            {!loading && data.length === 0 && (
                <div className="col-span-full text-center py-40">
                    <Soup size={80} className="mx-auto text-emerald-500/20 mb-8 animate-pulse" />
                    <p className="text-2xl font-bold text-white/30 uppercase tracking-widest">No restaurants found.</p>
                    <button onClick={() => { setSearch(''); setMinRating('0'); setMaxPrice('1000'); }} className="mt-8 text-emerald-500 font-bold border-b border-emerald-500 pb-1">Reset Filters</button>
                </div>
            )}
        </div>
    );
}
