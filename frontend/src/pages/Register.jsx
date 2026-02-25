import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, ArrowRight, Bookmark } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-zinc-50 font-sans selection:bg-indigo-500/10">
            {/* Left Column: Brand Panel */}
            <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-950 p-16 text-white">
                {/* Subtle abstract background elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 text-center max-w-sm space-y-6">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-in zoom-in-50 duration-700">
                        <Bookmark size={40} strokeWidth={2.5} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight italic animate-in slide-in-from-bottom-4 duration-700 delay-150">
                        SmartMark
                    </h1>
                    <div className="h-1 w-12 bg-white/20 mx-auto rounded-full"></div>
                    <p className="text-indigo-100 text-lg font-medium opacity-90 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        Simplify your digital library.
                        <br />
                        <span className="text-indigo-200/60 text-sm mt-4 inline-block font-bold uppercase tracking-widest">Global Protocol</span>
                    </p>
                </div>
            </div>

            {/* Right Column: Auth Section */}
            <div className="flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-[420px] animate-in slide-in-from-left-4 duration-700">
                    <div className="mb-10 lg:hidden text-center">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                            <Bookmark size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tighter italic">SmartMark</h1>
                    </div>

                    <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200/60">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Create Account</h2>
                            <p className="text-zinc-500 mt-2 font-medium">Join the next generation of digital librarians.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Universal Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-900 font-bold placeholder:text-zinc-400"
                                        placeholder="Alex Mercer"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Digital Identity (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-900 font-bold placeholder:text-zinc-400"
                                        placeholder="alex@smartmark.io"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Access Key (Password)</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-900 font-bold placeholder:text-zinc-400"
                                        placeholder="Min. 6 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin text-white" size={24} />
                                ) : (
                                    <>
                                        Establish Connection <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                            <p className="text-zinc-500 font-medium text-sm">
                                Already identified?{' '}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline underline-offset-4 decoration-2 transition-all ml-1">
                                    Proceed to Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                    {/* Optional support line */}
                    <p className="text-center mt-8 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        Node Establishment Protocol &copy; 2026 SmartMark
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
