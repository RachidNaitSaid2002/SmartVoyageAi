"use client";

import { AuthFormSplitScreen, AuthFormValues } from "@/components/ui/login";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
                <Link href="/" className="inline-block transition-transform hover:scale-105">
                    <span className="text-3xl font-black text-[#2D5A4C] tracking-tighter">Travello</span>
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
