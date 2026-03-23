"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on login, signup, and profile pages
    const isExcludedPage = pathname === '/login' || pathname === '/signup' || pathname === '/profile';

    if (isExcludedPage) return null;

    return (
        <footer className="bg-[#2D5A4C] text-white pt-20 pb-10">
            <div className="max-w-[1400px] mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-4xl font-black tracking-tighter text-white">Travello</span>
                        </Link>
                        <p className="text-white/70 text-sm font-medium leading-relaxed max-w-xs">
                            Booking your dream vacation was so easy! The website provided the best deals, and everything was seamless.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-extrabold text-lg mb-6">Important Links</h4>
                        <ul className="space-y-4 text-white/80 font-medium text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Career</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-extrabold text-lg mb-6">Support</h4>
                        <ul className="space-y-4 text-white/80 font-medium text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Guide</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Places</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-extrabold text-lg mb-6">Contact</h4>
                        <ul className="space-y-6 text-white/80 font-medium text-sm mt-4">
                            <li className="flex items-center gap-4">
                                <div className="bg-white/10 p-2.5 rounded-full text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                company@gmail.com
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="bg-white/10 p-2.5 rounded-full text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                +12345678910
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-white/10 p-2.5 rounded-full text-white shrink-0 mt-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span className="leading-loose pt-0.5 w-[160px]">77 Park View Road, London, England N11 9QK, GB</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-white/60">
                    <p>© 2025 Travello. All Rights Reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Terms and Conditions</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
