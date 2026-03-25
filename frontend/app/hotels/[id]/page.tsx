import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import {
    Clock, Building, Star, MapPin, Phone, Home, ShieldCheck,
    Award, Sliders, LayoutDashboard, Database, Activity,
    Zap, Gem, Waves, Utensils
} from 'lucide-react';

export default async function HotelDetail({ params }: { params: { id: string } }) {
    const { id } = await params;
    const dockerPath = path.join(process.cwd(), 'data');
    const localPath = path.join(process.cwd(), '..', 'backend', 'data');
    const BASE_PATH = fs.existsSync(dockerPath) ? dockerPath : localPath;

    let data = [];
    try {
        data = JSON.parse(fs.readFileSync(`${BASE_PATH}/HotelsData.json`, 'utf8'));
    } catch (e) {
        console.error("Error reading HotelsData.json", e);
    }

    const hotel = data.find((h: any) => h?.location?.locationV2?.locationId?.toString() === id);

    if (!hotel) return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 text-center font-bold">
            <h1 className="text-6xl mb-8 tracking-tight">Hotel not found</h1>
            <Link href="/hotels" className="text-emerald-500 hover:text-white transition-colors">Return to list</Link>
        </div>
    );

    const name = hotel?.location?.locationV2?.names?.name || 'Hôtel';
    let imageUrl =
        hotel?.location?.thumbnail?.photoSizeDynamic?.urlTemplate ||
        hotel?.location?.locationV2?.thumbnail?.photoSizeDynamic?.urlTemplate ||
        'https://placehold.co/1920x1080/0a0a0a/10b981?text=Neural+Link+Lost';

    if (imageUrl) {
        if (imageUrl.includes('{width}')) {
            imageUrl = imageUrl.replace('{width}', '1200').replace('{height}', '800');
        } else {
            imageUrl = imageUrl.replace(/\?w=\d+&h=\d+/, '?w=1200&h=800');
        }
    }

    const rating = hotel?.location?.reviewSummary?.rating || 'N/A';
    const reviews = hotel?.location?.reviewSummary?.count || 0;
    const priceRange = hotel?.location?.locationV2?.hotelPriceRanges || null;
    const address = hotel?.contact?.streetAddress?.fullAddress || 'Address Unknown';
    const amenities = hotel?.resultDetail?.amenities?.highlightedAmenities || [];
    const rankings = hotel?.location?.locationV2?.hotelHierarchicalPopIndex || null;
    const styles = hotel?.location?.locationV2?.hotelStyleRankings || [];
    const labels = hotel?.resultDetail?.merchandisingLabels || [];

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-emerald-500 selection:text-white pb-32">
            <Navbar className="fixed !bg-transparent backdrop-blur-3xl z-[100]" />

            {/* HOLOGRAPHIC HERO */}
            <div className="relative w-full h-[80vh] overflow-hidden group">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-all duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>

                <div className="absolute top-32 left-8 md:left-16 z-10 flex flex-col md:flex-row gap-6">
                    <Link href="/hotels" className="px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                        <Building size={14} className="text-emerald-500" />
                        Back to Hotels
                    </Link>
                    <div className="px-6 py-3 bg-emerald-500/10 backdrop-blur-3xl border border-emerald-500/20 rounded-2xl text-[10px] font-bold text-emerald-500 uppercase tracking-widest transition-all flex items-center gap-3">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Verified Stay
                    </div>
                </div>

                <div className="absolute bottom-16 left-8 md:left-16 right-8 z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                                {labels.map((label: any, i: number) => (
                                    <span key={i} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 tracking-[.4em] uppercase">
                                        {label.text}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-6xl md:text-[7vw] font-bold tracking-tight leading-[0.9] mb-8">
                                {name}
                            </h1>
                            <div className="flex flex-wrap gap-8 text-white/60 font-medium text-[10px] uppercase tracking-widest items-center">
                                <div className="flex items-center gap-3 border-l-2 border-emerald-500/30 pl-8">
                                    <Star size={18} fill="currentColor" className="text-yellow-500" />
                                    {rating} <span className="opacity-40">({reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-3 border-l-2 border-emerald-500/30 pl-8">
                                    <MapPin size={18} className="text-emerald-500" />
                                    {address}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROPERTY DETAILS */}
            <main className="max-w-[1700px] mx-auto px-8 md:px-16 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* PRIMARY LOG */}
                <div className="lg:col-span-8 space-y-20">

                    {/* STYLE NODES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {styles.map((style: any, i: number) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-10 rounded-3xl hover:border-emerald-500/20 transition-all group">
                                <Award className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" size={24} />
                                <h6 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Style Rank #{style.geoRanking}</h6>
                                <p className="text-xl font-black text-white">{style.styleName}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#121212] p-12 md:p-20 rounded-3xl border border-white/5 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                            <Building size={240} />
                        </div>
                        <h2 className="text-4xl font-bold mb-12 tracking-tight flex items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                                <Building size={28} />
                            </div>
                            About this Hotel
                        </h2>
                        <div className="text-white/40 leading-[1.8] text-xl font-medium max-w-4xl border-l-4 border-emerald-500/20 pl-12 mb-16">
                            {rankings?.localizedTypePopIndexString || "Experience one of the top-rated hotels in Agadir, offering premium service and comfortable stays."}
                        </div>

                        {amenities.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {amenities.map((am: any, i: number) => (
                                    <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex flex-col items-center text-center group hover:bg-emerald-500/5 transition-colors">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:rotate-12 transition-transform">
                                            <Gem size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{am.amenityName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DYNAMIC PRICE ESTIMATE (IF AVAIL) */}
                    <div className="bg-emerald-500 text-black p-16 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group cursor-pointer shadow-2xl">
                        <div className="absolute top-0 left-0 p-12 opacity-10">
                            <Waves size={160} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Price Range</h3>
                            <div className="text-6xl font-bold tracking-tight leading-none mb-4">
                                {priceRange?.minimum || '107'} MAD <span className="text-2xl opacity-50 font-bold"> - </span> {priceRange?.maximum || '262'} MAD
                            </div>
                            <p className="text-sm font-medium uppercase tracking-widest opacity-60">Estimated nightly rate</p>
                        </div>
                        <div className="relative z-10">
                            <button className="px-12 py-6 bg-black text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* SECONDARY SIDEBAR */}
                <div className="lg:col-span-4 space-y-12">

                    {/* HIERARCHY DATA */}
                    <div className="bg-[#121212] p-10 rounded-3xl border border-white/5 shadow-2xl">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-500 mb-8 flex items-center gap-3">
                            <Database size={16} />
                            Property Details
                        </h4>
                        <div className="space-y-6">
                            <div className="pb-6 border-b border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-2">Local Ranking</p>
                                <p className="text-2xl font-bold text-white">#{rankings?.rank || '02'} <span className="text-sm text-neutral-500 font-medium tracking-normal">of {rankings?.outof || '304'}</span></p>
                            </div>
                            <div className="pb-6 border-b border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-2">Recommended</p>
                                <p className="text-2xl font-bold text-emerald-500">98% <span className="text-xs text-emerald-500/50 uppercase font-medium">Rating Match</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-2">Contact</p>
                                <p className="text-lg font-bold text-white">{hotel.location.locationV2.contact.telephone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                        <ShieldCheck size={32} className="text-emerald-500 mb-6" />
                        <h4 className="text-xl font-bold mb-4 tracking-tight">Verified Property</h4>
                        <p className="text-sm font-medium text-white/40 leading-relaxed">This hotel has been verified by our team for quality and service standards.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
