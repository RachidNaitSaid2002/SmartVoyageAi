"use client";

import { AuthFormSplitScreen, AuthFormValues } from "@/components/ui/login";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();

    const handleSignup = async (data: AuthFormValues) => {
        try {
            const res = await fetch('http://localhost:8000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, password: data.password })
            });

            const resData = await res.json();
            if (res.ok) {
                router.push('/login?message=Account created successfully. Please login.');
            } else {
                alert(resData.detail || 'Signup failed');
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert('Something went wrong. Please check your connection.');
        }
    };

    return (
        <AuthFormSplitScreen
            logo={
                <Link href="/" className="inline-block transition-transform hover:scale-105">
                    <span className="text-3xl font-black text-emerald-500 tracking-tighter uppercase italic">Travello</span>
                </Link>
            }
            title="Initialize ID."
            description="Create your neural traveler profile to unlock the full potential of Agadir."
            videoSrc="/make_this_video_202603181538.mp4"
            imageAlt="Travel background video"
            onSubmit={handleSignup}
            forgotPasswordHref="#"
            createAccountHref="/signup"
            isSignup={true}
        />
    );
}
