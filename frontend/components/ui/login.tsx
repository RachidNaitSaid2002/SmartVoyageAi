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
import { Loader2, ShieldCheck, BrainCircuit, Activity } from "lucide-react";

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
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col md:flex-row bg-[#050505] selection:bg-emerald-500 selection:text-white">
            {/* Left Panel: Form */}
            <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>

                <div className="w-full max-w-md relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-6"
                    >
                        <motion.div variants={itemVariants} className="mb-4">
                            <div className="scale-110 origin-left invert brightness-200">
                                {logo}
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="text-left">
                            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">{title}</h1>
                            <p className="text-sm font-black text-white/30 uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                                <Activity size={14} className="text-emerald-500" />
                                {description}
                            </p>
                        </motion.div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative">
                            <div className="absolute top-6 right-8 text-emerald-500/20">
                                <ShieldCheck size={40} strokeWidth={1} />
                            </div>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleFormSubmit)}
                                    className="space-y-8"
                                >
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Neural Node ID</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="IDENTIFYING SIGNAL..."
                                                            {...field}
                                                            disabled={isLoading}
                                                            className="bg-black/40 border-white/5 focus:border-emerald-500/50 rounded-2xl py-7 font-black tracking-widest text-xs uppercase text-white"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Access Cipher</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••••••"
                                                            {...field}
                                                            disabled={isLoading}
                                                            className="bg-black/40 border-white/5 focus:border-emerald-500/50 rounded-2xl py-7 font-black tracking-widest text-xs text-white"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={itemVariants}
                                        className="flex items-center justify-between"
                                    >
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
                                                                className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 bg-black/40"
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-black text-[10px] text-white/30 uppercase tracking-widest">
                                                            Keep Active Link
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                        {!isSignup && (
                                            <a
                                                href={forgotPasswordHref}
                                                className="text-[10px] font-black text-emerald-500/50 hover:text-emerald-400 uppercase tracking-widest transition-colors"
                                            >
                                                LOST CIPHER?
                                            </a>
                                        )}
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="lg"
                                            className="w-full rounded-[1.5rem] font-black tracking-[.2em] py-8 h-auto bg-emerald-500 text-black hover:bg-emerald-400 border-none shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                                            disabled={isLoading}
                                        >
                                            {isLoading && (
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            )}
                                            {isSignup ? "AUTHORIZE NODE" : "ESTABLISH UPLINK"}
                                        </Button>
                                    </motion.div>
                                </form>
                            </Form>
                        </div>

                        <motion.p
                            variants={itemVariants}
                            className="text-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-8"
                        >
                            {isSignup ? "Existing protocol detected? " : "New node in network? "}
                            <a
                                href={isSignup ? "/login" : "/signup"}
                                className="font-black text-emerald-500 hover:text-white transition-colors ml-1 underline underline-offset-4 decoration-2"
                            >
                                {isSignup ? "RETURN TO LOGIN" : "INITIALIZE SYNC"}
                            </a>
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel: Immersive Visuals */}
            <div className="relative hidden w-1/2 md:block overflow-hidden border-l border-white/5">
                {videoSrc ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover opacity-60 transition-transform duration-[20s] hover:scale-125"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="h-full w-full object-cover opacity-60 transition-transform duration-[20s] hover:scale-125"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

                {/* HUD Elements */}
                <div className="absolute bottom-16 left-16 right-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-emerald-500"></div>
                            <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em]">System Status: Online</div>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-none tracking-tighter drop-shadow-2xl italic">
                            SCAN THE <br />UNSEEN<span className="text-emerald-500">.</span>
                        </h2>
                        <div className="flex gap-8 mt-4">
                            <div>
                                <p className="text-emerald-500 font-black text-lg">04.88</p>
                                <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mt-1">LATITUDE ACCURACY</p>
                            </div>
                            <div>
                                <p className="text-emerald-500 font-black text-lg">99.8%</p>
                                <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mt-1">NEURAL SYNC</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ANIMATED GRID OVERLAY */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505] to-transparent z-10"></div>
                <div className="absolute top-0 right-0 p-12 text-emerald-500/20">
                    <BrainCircuit size={60} strokeWidth={1} />
                </div>
            </div>
        </div>
    );
}
