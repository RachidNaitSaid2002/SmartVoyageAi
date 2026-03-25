"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

// Validation schema for the form
const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
    rememberMe: z.boolean().default(false).optional(),
});

export type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormSplitScreenProps {
    logo: React.ReactNode;
    title: string;
    description: string;
    imageSrc?: string;
    videoSrc?: string;
    imageAlt: string;
    onSubmit: (data: AuthFormValues) => Promise<void>;
    forgotPasswordHref: string;
    createAccountHref: string;
    isSignup?: boolean;
}

export function AuthFormSplitScreen({
    logo,
    title,
    description,
    imageSrc,
    videoSrc,
    imageAlt,
    onSubmit,
    forgotPasswordHref,
    createAccountHref,
    isSignup = false,
}: AuthFormSplitScreenProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const handleFormSubmit = async (data: AuthFormValues) => {
        setIsLoading(true);
        try {
            await onSubmit(data);
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -mb-48"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] relative z-10"
            >
                {/* Left Panel: Form */}
                <div className="w-full md:w-1/2 flex flex-col p-10 md:p-20 justify-center">
                    <div className="mb-12">
                        {logo}
                    </div>

                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
                            {isSignup ? "Start Journey" : title}
                        </h1>
                        <p className="text-white/40 text-lg font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleFormSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="name@example.com"
                                                {...field}
                                                disabled={isLoading}
                                                className="bg-white/[0.03] border-white/10 focus:border-emerald-500 focus:ring-0 focus:ring-offset-0 rounded-2xl h-16 px-8 text-[15px] font-medium text-white transition-all placeholder:text-white/20"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500/80" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                disabled={isLoading}
                                                className="bg-white/[0.03] border-white/10 focus:border-emerald-500 focus:ring-0 focus:ring-offset-0 rounded-2xl h-16 px-8 text-[15px] font-medium text-white transition-all placeholder:text-white/20"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500/80" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between">
                                {!isSignup && (
                                    <FormField
                                        control={form.control}
                                        name="rememberMe"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isLoading}
                                                        className="bg-white/5 border-white/10 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-md transition-colors w-5 h-5"
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-semibold text-sm text-white/30 cursor-pointer select-none">
                                                    Remember me
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {!isSignup && (
                                    <a
                                        href={forgotPasswordHref}
                                        className="text-sm font-bold text-white/30 hover:text-emerald-500 transition-colors"
                                    >
                                        Forgot Password?
                                    </a>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full rounded-2xl font-bold h-16 bg-emerald-500 text-black hover:bg-emerald-400 border-none shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] text-base mb-8"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isSignup ? "Create Account" : "Sign In"}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center text-white/20 text-sm font-semibold mt-10">
                        {isSignup ? "Already have an account? " : "Don't have an account? "}
                        <a
                            href={isSignup ? "/login" : "/signup"}
                            className="font-bold text-emerald-500 hover:text-white transition-all ml-2 underline underline-offset-4"
                        >
                            {isSignup ? "Sign In" : "Sign Up"}
                        </a>
                    </p>
                </div>

                {/* Right Panel: Video Background */}
                <div className="hidden md:block w-1/2 relative bg-[#050505]">
                    {videoSrc ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[20s] hover:scale-110"
                        >
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-[20s] hover:scale-110"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0f0f0f]/40 to-[#0f0f0f] z-10" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic drop-shadow-2xl">
                                DISCOVER<br />THE WORLD<span className="text-emerald-500">.</span>
                            </h2>
                            <div className="flex gap-12 justify-center items-center mt-8">
                                <div className="text-left border-l-2 border-emerald-500 pl-6">
                                    <p className="text-white font-black text-xl tracking-tight">Agadir</p>
                                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">Destination Focus</p>
                                </div>
                                <div className="text-left border-l-2 border-emerald-500 pl-6">
                                    <p className="text-white font-black text-xl tracking-tight">Active</p>
                                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">Smart Connection</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
