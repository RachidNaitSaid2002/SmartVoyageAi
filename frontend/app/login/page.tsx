"use client";

import { AuthFormSplitScreen, AuthFormValues } from "@/components/ui/login";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (data: AuthFormValues) => {
        try {
            const res = await fetch('http://localhost:8000/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, password: data.password })
            });

            const resData = await res.json();
            if (res.ok) {
                const userRes = await fetch('http://localhost:8000/api/users/me', {
                    headers: { 'Authorization': `Bearer ${resData.access_token}` }
                });
                const userData = await userRes.json();
                login(resData.access_token, userData);
                router.push('/');
            } else {
                alert(resData.detail || 'Login failed');
            }
        } catch (err) {
            console.error("Login error:", err);
            alert('Something went wrong. Please check your connection.');
        }
    };

    return (
        <AuthFormSplitScreen
            logo={
                <Link href="/" className="inline-block transition-transform hover:scale-110">
                    <span className="text-3xl font-black text-emerald-500 tracking-tighter flex items-center gap-3 italic">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <Activity size={24} />
                        </div>
                        Travello
                    </span>
                </Link>
            }
            title="Welcome Home."
            description="Enter your credentials to access your personalized travel dashboard."
            videoSrc="/make_this_video_202603181538.mp4"
            imageAlt="Travel background video"
            onSubmit={handleLogin}
            forgotPasswordHref="#"
            createAccountHref="/signup"
        />
    );
}
