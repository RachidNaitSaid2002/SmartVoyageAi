import fs from 'fs';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import {
    Clock, Utensils, Star, MapPin, Phone, Mail, Globe,
    MessageSquare, CheckCircle2, Image as ImageIcon,
    History, Award, Fingerprint, BrainCircuit, Activity, ShieldCheck
} from 'lucide-react';

export default async function RestaurantDetail({ params }: { params: { id: string } }) {
    const { id } = await params;
    const BASE_PATH = '/home/rachid/Projects/file_rouge/backend/data';

    let data = [];
    try {
        data = JSON.parse(fs.readFileSync(`${BASE_PATH}/restaurantDetails.json`, 'utf8'));
    } catch (e) {
        console.error("Error reading restaurantDetails.json", e);
    }

    const restaurant = data.find((r: any) => r?.id?.toString() === id);

    if (!restaurant) return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 text-center font-black">
            <h1 className="text-6xl mb-8 tracking-tighter">DATA NODE LOSS</h1>
            <Link href="/restaurants" className="px-8 py-3 bg-emerald-500 text-black rounded-full text-[10px] uppercase tracking-widest whitespace-nowrap">Return to Grid</Link>
        </div>
    );

    const name = restaurant?.name || 'Restaurant';
    const imageUrl = restaurant?.image || 'https://placehold.co/1600x900/0a0a0a/10b981?text=Neural+Link+Lost';
    const rating = restaurant?.rating || 'N/A';
    const reviews = restaurant?.numberOfReviews || 0;
    const rankingStr = restaurant?.rankingString || restaurant?.rankingPosition || 'Prime Node';
    const address = restaurant?.address || 'Node Location Unknown';
    const cuisines = restaurant?.cuisines || [];
    const photos = restaurant?.photos || [];
    const hours = restaurant?.hours?.weekRanges || [];
    const openNow = restaurant?.openNowText || 'Scanning Status...';

    const renderRatingHistogram = () => {
        if (!restaurant?.ratingHistogram) return null;
        const hist = restaurant.ratingHistogram;
        const total = Object.values(hist).reduce((a: any, b: any) => a + b, 0) as number;
        return (
            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(num => {
                    const count = (hist[`count${num}`] || 0) as number;
                    const percent = (count / total) * 100;
                    return (
                        <div key={num} className="flex items-center gap-4 group">
                            <span className="text-[10px] font-black text-white/30 w-12">{num} STAR</span>
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500/60 group-hover:bg-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="text-[10px] font-black text-white/50 w-8">{count}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-emerald-500 selection:text-white pb-32 overflow-hidden">
            <Navbar className="fixed !bg-transparent backdrop-blur-3xl z-[100]" />

            {/* HOLOGRAPHIC HERO */}
            <div className="relative w-full h-[70vh] group overflow-hidden">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-[2000ms] scale-105 group-hover:scale-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>

                <div className="absolute top-32 left-8 md:left-16 z-10 flex flex-col md:flex-row gap-6">
                    <Link href="/restaurants" className="px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all inline-flex items-center gap-3">
                        <Fingerprint size={14} className="text-emerald-500" />
                        Network Grid
                    </Link>
                    <div className="px-6 py-3 bg-emerald-500/10 backdrop-blur-3xl border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest transition-all inline-flex items-center gap-3 animate-pulse">
                        <Activity size={14} className="text-emerald-500" />
                        {openNow}
                    </div>
                </div>

                <div className="absolute bottom-16 left-8 md:left-16 right-8 z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 tracking-[.3em] uppercase underline decoration-2 underline-offset-4">
                                    Gastronomy Terminal
                                </span>
                                <div className="text-sm font-black text-white/40 tracking-widest uppercase">
                                    Synced @ Chroma-Neural
                                </div>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                                {name.split(' ').map((word: string, i: number) => (
                                    <span key={i} className={i === 1 ? "text-emerald-500" : ""}>{word} </span>
                                ))}
                            </h1>
                            <div className="flex flex-wrap gap-8 text-white/60 font-medium text-lg uppercase tracking-widest text-[10px]">
                                <div className="flex items-center gap-3 border-l-2 border-emerald-500/30 pl-6">
                                    <Star size={16} fill="currentColor" className="text-yellow-500" />
                                    {rating} <span className="text-white/20">/ AI Global Review Score</span>
                                </div>
                                <div className="flex items-center gap-3 border-l-2 border-emerald-500/30 pl-6">
                                    <Award size={16} className="text-emerald-500" />
                                    {rankingStr}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEURAL DATA GRID */}
            <main className="max-w-[1600px] mx-auto px-8 md:px-16 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* PRIMARY LOG */}
                <div className="lg:col-span-8 space-y-20">

                    {/* GALLERY TILES */}
                    {photos.length > 0 && (
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[.6em] text-emerald-500">Visual Telemetry</h3>
                            <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar">
                                {photos.map((ph: string, i: number) => (
                                    <div key={i} className="min-w-[400px] h-[300px] rounded-[3rem] overflow-hidden border border-white/5 grayscale-[20%] hover:grayscale-0 transition-all cursor-crosshair group relative">
                                        <img src={ph} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-1000" alt={`Scan ${i}`} />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-[#121212] p-12 md:p-20 rounded-[5rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <Utensils size={200} />
                        </div>
                        <h2 className="text-4xl font-black mb-12 tracking-tighter flex items-center gap-8">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                                <BrainCircuit size={40} />
                            </div>
                            Culinary Computation
                        </h2>
                        <div className="text-white/50 leading-[2] text-2xl font-medium whitespace-pre-wrap max-w-4xl italic border-l-4 border-emerald-500/20 pl-12 mb-16">
                            {restaurant.description || `Automatic log entry: ${name} is a high-ranking culinary node in Agadir, specializing in ${cuisines.join(', ')} profiles. Neural analysis predicts a premium gastronomic experience.`}
                        </div>

                        {cuisines.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {cuisines.map((c: string, i: number) => (
                                    <span key={i} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/50 uppercase tracking-widest hover:text-emerald-400 transition-colors">
                                        # {c} profile
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CONTACT DATA NODES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: MapPin, label: 'Geo-Coordinates', val: address },
                            { icon: Phone, label: 'Frequency', val: restaurant.phone },
                            { icon: Mail, label: 'Neural Link', val: restaurant.email }
                        ].map((node, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-10 rounded-[3rem] hover:border-emerald-500/20 transition-all">
                                <node.icon className="text-emerald-500 mb-6" size={24} />
                                <h6 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">{node.label}</h6>
                                <p className="text-sm font-bold text-white/80 line-clamp-2 leading-relaxed">{node.val || 'NULL'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECONDARY SIDEBAR */}
                <div className="lg:col-span-4 space-y-12">

                    {/* RESERVE UNIT */}
                    <div className="bg-[#132922] p-12 rounded-[4rem] border border-emerald-500/20 shadow-[0_50px_100px_rgba(16,185,129,0.1)] relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                        <p className="text-[10px] font-black uppercase tracking-[.4em] text-emerald-400 mb-6">Reservation Engine</p>
                        <div className="text-6xl font-black text-white mb-10 tracking-tighter">
                            {restaurant.priceRange || restaurant.priceLevel || 'MID'}
                        </div>
                        <button className="w-full py-7 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-[.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl mb-8">
                            Lock Table
                        </button>
                        <div className="flex items-center justify-center gap-3 py-4 border-2 border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[.2em] text-white/40">
                            <ShieldCheck size={12} className="text-emerald-400" /> Secure Encryption Active
                        </div>
                    </div>

                    {/* REVIEWS HUB */}
                    <div className="bg-[#121212] p-10 rounded-[4rem] border border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-[.4em] text-emerald-500 mb-10">Biometric feedback</h4>
                        {renderRatingHistogram()}
                        <div className="mt-12 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                {reviews} Global Data Logs
                            </div>
                        </div>
                    </div>

                    {/* OPERATIONAL HOURS */}
                    {hours.length > 0 && (
                        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 group">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[.4em] text-neutral-500">Node Availability</h4>
                                <History size={20} className="text-emerald-500/30 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="space-y-4">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 group/row">
                                        <span className="text-[10px] font-black text-white/20 group-hover/row:text-emerald-400 transition-colors uppercase">{day}</span>
                                        <span className="text-xs font-bold text-white/50">{hours[i] ? `${hours[i][0].openHours} - ${hours[i][0].closeHours}` : '11:00 - 02:00'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


