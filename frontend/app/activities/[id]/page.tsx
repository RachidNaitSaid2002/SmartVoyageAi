import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { Clock, Tag, Info, Star, MapPin, CheckCircle2, Image as ImageIcon, Wallet, ShieldCheck, Heart, BrainCircuit, Activity, Compass } from 'lucide-react';

export default async function ActivityDetail({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Detect data location (Docker vs Local)
    const dockerPath = path.join(process.cwd(), 'data');
    const localPath = path.join(process.cwd(), '..', 'backend', 'data');
    const BASE_PATH = fs.existsSync(dockerPath) ? dockerPath : localPath;

    let activities = [];
    try {
        activities = JSON.parse(fs.readFileSync(`${BASE_PATH}/Activites.json`, 'utf8'));
    } catch (e) {
        console.error("Error reading Activites.json", e);
    }

    let freeActivitiesRaw = [];
    try {
        freeActivitiesRaw = JSON.parse(fs.readFileSync(`${BASE_PATH}/freeactivites.json`, 'utf8'));
    } catch (e) { }

    let activity = activities.find((a: any) => a?.id?.toString() === id);
    let isFree = false;

    if (!activity) {
        let f = freeActivitiesRaw.find((a: any) => a?.id?.toString() === id);
        if (f) {
            isFree = true;
            let priceStr = '0';
            if (f?.offerGroup?.lowestPrice) {
                priceStr = f.offerGroup.lowestPrice.replace(/[^0-9.]/g, '');
            }
            activity = {
                title: f?.name || '',
                score: f?.rating || '0',
                price: priceStr,
                image_url: f?.image || '',
                duration: f?.subcategories ? f.subcategories.join(', ') : 'Activité Libre',
                review_count: f?.numberOfReviews || 0,
                details: {
                    description: f?.description || ''
                }
            };
        }
    }

    if (!activity) return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 text-center font-bold">
            <h1 className="text-4xl mb-8 tracking-tight">Activity not found</h1>
            <Link href="/activities" className="text-emerald-500 hover:text-white transition-colors">Return to list</Link>
        </div>
    );

    const name = activity?.title || 'Activité';
    let imageUrl = activity?.image_url || 'https://placehold.co/1600x900/0a0a0a/10b981?text=Neural+Link+Lost';

    // Scale up GetYourGuide images if they are small thumbnails
    if (imageUrl.includes('cdn.getyourguide.com')) {
        imageUrl = imageUrl.replace(/\/\d+\.jpg$/, '/88.jpg'); // 88 is usually the larger format in their CDN
    }
    const rating = activity?.score || 'N/A';
    const reviews = activity?.review_count || 0;
    const price = activity?.price || '0';
    const duration = activity?.duration || '';
    const description = activity?.details?.description || activity?.description || 'No detailed log available for this node.';

    // Rich Data from JSON
    const highlights = activity?.details?.details?.Highlights || [];
    const about = activity?.details?.about || [];
    const gallery = activity?.details?.images || [];

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-emerald-500 selection:text-white pb-32">
            <Navbar className="fixed !bg-transparent backdrop-blur-3xl z-[100]" />

            {/* HOLOGRAPHIC HERO */}
            <div className="relative w-full h-[75vh] overflow-hidden">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>

                <div className="absolute top-32 left-8 md:left-16 z-10">
                    <Link href="/activities" className="px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                        <Compass size={14} className="text-emerald-500" />
                        Back to Activities
                    </Link>
                </div>

                <div className="absolute bottom-16 left-8 md:left-16 right-8 z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 tracking-widest uppercase">
                                    {activity.category || "Experience"}
                                </span>
                                <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
                                    <Star size={16} fill="currentColor" />
                                    {rating} <span className="text-white/30 font-medium">({reviews} reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-none mb-8">
                                {name}
                            </h1>
                            <div className="flex flex-wrap gap-8 text-white/60 font-medium text-lg uppercase tracking-widest text-xs">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-emerald-500" />
                                    {duration}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag size={16} className="text-emerald-500" />
                                    {activity.tags || "Live Session"}
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-500 text-black p-10 rounded-3xl shadow-xl min-w-[300px]">
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-70">Price</p>
                            <div className="text-5xl font-bold mb-8">
                                {price} <span className="text-sm font-bold uppercase tracking-widest">{isFree ? 'USD' : 'MAD'}</span>
                            </div>
                            <button className="w-full py-6 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Book Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTIVITY DETAILS */}
            <main className="max-w-[1600px] mx-auto px-8 md:px-16 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* PRIMARY LOG */}
                <div className="lg:col-span-8 space-y-20">

                    {/* GALLERY */}
                    {gallery.length > 0 && (
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Photo Gallery</h3>
                            <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar">
                                {gallery.map((img: string, i: number) => (
                                    <div key={i} className="min-w-[400px] h-[300px] rounded-3xl overflow-hidden border border-white/5 grayscale-[30%] hover:grayscale-0 transition-all cursor-crosshair">
                                        <img src={img} className="w-full h-full object-cover" alt={`Angle ${i}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-[#121212] p-12 md:p-16 rounded-3xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BrainCircuit size={120} />
                        </div>
                        <h2 className="text-4xl font-bold mb-10 tracking-tight flex items-center gap-6">
                            <span className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                                <Info size={28} />
                            </span>
                            About this experience
                        </h2>
                        <div className="text-white/50 leading-relaxed text-xl font-medium whitespace-pre-wrap max-w-4xl italic border-l-2 border-emerald-500/20 pl-10">
                            {description}
                        </div>
                    </div>

                    {/* HIGHLIGHTS */}
                    {highlights.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {highlights.map((h: any, i: number) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-all flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <p className="text-lg font-bold text-white/80 tracking-tight leading-tight">{h.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SECONDARY NODES */}
                <div className="lg:col-span-4 space-y-12">

                    {/* BIOMETRIC COMPATIBILITY */}
                    <div className="bg-[#132922] p-10 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-8 flex items-center gap-2">
                            <Activity size={14} />
                            Important Information
                        </h4>
                        <div className="space-y-6">
                            {about.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <div className="shrink-0 text-emerald-400" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
                                    <div>
                                        <h5 className="text-sm font-black text-white uppercase tracking-wider">{item.term}</h5>
                                        <p className="text-xs text-white/40 font-medium leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECURITY PROTOCOL */}
                    <div className="bg-white/5 p-10 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[.4em] text-neutral-500 mb-6">Security Protocol</p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-xs font-bold text-white/60">
                                <ShieldCheck size={14} className="text-emerald-500" /> Verified Merchant
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-white/60">
                                <ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-white/60">
                                <ShieldCheck size={14} className="text-emerald-500" /> Biometric Authentication
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
