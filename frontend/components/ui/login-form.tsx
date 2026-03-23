"use client";
import { useEffect, useRef, useState } from "react";
import { User, Lock, ArrowRight, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

// Vertex shader source code
const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// Fragment shader source code for the smokey background effect
const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    // Normalize mouse input (0.0 - 1.0) and remap to -1.0 ~ 1.0
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    // Apply distortion for a wavy, smokey effect
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    // Create a glowing wave pattern
    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

/**
 * Valid blur sizes supported by Tailwind CSS.
 */
type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

/**
 * Props for the SmokeyBackground component.
 */
interface SmokeyBackgroundProps {
    backdropBlurAmount?: string;
    color?: string;
    className?: string;
}

/**
 * A mapping from blur size names to Tailwind CSS classes.
 */
const blurClassMap: Record<BlurSize, string> = {
    none: "backdrop-blur-none",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
    "3xl": "backdrop-blur-3xl",
};

/**
 * A React component that renders an interactive WebGL shader background.
 */
export function SmokeyBackground({
    backdropBlurAmount = "sm",
    color = "#1E40AF", // Default dark blue
    className = "",
}: SmokeyBackgroundProps): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Helper to convert hex color to RGB (0-1 range)
    const hexToRgb = (hex: string): [number, number, number] => {
        const r = parseInt(hex.substring(1, 3), 16) / 255;
        const g = parseInt(hex.substring(3, 5), 16) / 255;
        const b = parseInt(hex.substring(5, 7), 16) / 255;
        return [r, g, b];
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        const compileShader = (type: number, source: string): WebGLShader | null => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program linking error:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
        const iTimeLocation = gl.getUniformLocation(program, "iTime");
        const iMouseLocation = gl.getUniformLocation(program, "iMouse");
        const uColorLocation = gl.getUniformLocation(program, "u_color");

        let startTime = Date.now();
        const [r, g, b] = hexToRgb(color);
        gl.uniform3f(uColorLocation, r, g, b);

        const render = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);

            const currentTime = (Date.now() - startTime) / 1000;

            gl.uniform2f(iResolutionLocation, width, height);
            gl.uniform1f(iTimeLocation, currentTime);
            gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : width / 2, isHovering ? height - mousePosition.y : height / 2);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        };
        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseenter", handleMouseEnter);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        render();

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseenter", handleMouseEnter);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isHovering, mousePosition, color]);

    const finalBlurClass = blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap["sm"];

    return (
        <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className={`absolute inset-0 ${finalBlurClass}`}></div>
        </div>
    );
}

/**
 * A glassmorphism-style login form component with animated labels and Google login.
 */
export function LoginForm({ isSignup = false }: { isSignup?: boolean }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isSignup
            ? 'http://localhost:8000/api/auth/signup'
            : 'http://localhost:8000/api/auth/signin';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                if (isSignup) {
                    router.push('/login?message=Account created successfully.');
                } else {
                    const userRes = await fetch('http://localhost:8000/api/users/me', {
                        headers: { 'Authorization': `Bearer ${data.access_token}` }
                    });
                    const userData = await userRes.json();
                    login(data.access_token, userData);
                    router.push('/');
                }
            } else {
                setError(data.detail || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm p-10 space-y-8 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-6 shadow-2xl shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    V
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="mt-2 text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{isSignup ? 'Start your journey' : 'Access your profile'}</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider animate-pulse relative z-10">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Email Address</label>
                    <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-emerald-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/5 hover:bg-white/10 px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all font-bold text-white placeholder:text-white/10"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Secret Password</label>
                    <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-emerald-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/5 hover:bg-white/10 px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all font-bold text-white placeholder:text-white/10"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {!isSignup && (
                    <div className="flex justify-end pr-1">
                        <a href="#" className="text-[10px] font-black text-white/20 hover:text-white transition uppercase tracking-widest">Forgot Password?</a>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="group w-full h-16 bg-white hover:bg-emerald-50 text-neutral-900 rounded-2xl font-black tracking-widest text-sm transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-4 border-neutral-900/10 border-t-neutral-900 rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {isSignup ? 'CREATE ACCOUNT' : 'LOG IN'}
                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">Quick Access</span>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>

                <button
                    type="button"
                    className="w-full flex items-center justify-center py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white font-bold text-sm transition-all"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5S45.5 36.017 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.839-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.642 6.723 6.306 14.691z"></path><path fill="#4CAF50" d="M24 45.5c5.613 0 10.553-2.306 14.802-6.341l-5.839-5.841C30.842 35.846 27.059 38 24 38c-5.039 0-9.345-2.608-11.124-6.481l-6.571 4.819C9.642 41.277 16.318 45.5 24 45.5z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.839 5.841C44.196 35.123 45.5 29.837 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path>
                    </svg>
                    Google
                </button>
            </form>

            <div className="text-center pt-2 relative z-10">
                <p className="text-[10px] font-bold text-white/30 tracking-wide">
                    {isSignup ? "Already a member? " : "New to Voyage? "}
                    <Link href={isSignup ? "/login" : "/signup"} className="font-black text-emerald-400 hover:text-emerald-300 transition uppercase tracking-widest ml-1 underline decoration-emerald-500/20 underline-offset-4">
                        {isSignup ? 'Login here' : 'Join now'}
                    </Link>
                </p>
            </div>
        </div>
    );
}
