import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Truck, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de la connexion');
            }

            localStorage.setItem('token', result.token);
            toast.success("Connexion réussie");

            if (result.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/conducteur/dashboard');
            }
        } catch (error) {
            toast.error(error.message || 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, rgb(255,255,255) 0%, rgb(25,42,86) 100%)` }}
        >
            {/* Decorative geometric patterns */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 rotate-45" style={{ background: 'rgb(0,117,73)', opacity: 0.1 }}></div>
                <div className="absolute top-32 right-20 w-16 h-16 rotate-12" style={{ background: 'rgb(199,132,0)', opacity: 0.1 }}></div>
                <div className="absolute bottom-20 left-32 w-24 h-24 rotate-45" style={{ background: 'rgb(0,66,140)', opacity: 0.1 }}></div>
                <div className="absolute bottom-40 right-10 w-12 h-12 rotate-45" style={{ background: 'rgb(0,117,73)', opacity: 0.1 }}></div>

                {/* Star patterns */}
                <Star className="absolute top-20 right-40 w-6 h-6 text-black opacity-5 rotate-12" />
                <Star className="absolute bottom-32 left-20 w-8 h-8 text-black opacity-5 rotate-45" />
                <Star className="absolute top-1/2 left-10 w-4 h-4 text-black opacity-5" />
            </div>

            <div className="w-full max-w-lg relative z-10">
                <div className="backdrop-blur-sm bg-white/95 rounded-3xl shadow-2xl overflow-hidden border-2" style={{ borderColor: 'rgb(0,66,140)' }}>
                    {/* Header */}
                    <div className="px-8 py-8 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, rgb(0,66,140) 0%, rgb(0,117,73) 50%, rgb(199,132,0) 100%)` }}>
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-4 left-4 w-3 h-3 bg-white/20 rotate-45"></div>
                            <div className="absolute top-6 right-8 w-2 h-2 bg-white/30 rotate-45"></div>
                            <div className="absolute bottom-4 left-8 w-4 h-4 bg-white/15 rotate-45"></div>
                            <Star className="absolute bottom-3 right-4 w-3 h-3 text-white/20" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30">
                                <Truck className="h-10 w-10 text-white drop-shadow-md" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">TransportConnect</h1>
                            <p className="text-white/90 text-sm font-medium">Connectez-vous à votre espace</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                    Email professionnel
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'rgb(50,50,50)' }} />
                                    <input
                                        type="email"
                                        {...register("email", { required: true })}
                                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 transition-all duration-300 ${errors.email
                                            ? 'border-red-400 ring-2 ring-red-100'
                                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            } focus:outline-none`}
                                        placeholder="email@exemple.com"
                                        style={{ color: 'rgb(0,0,0)' }}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">Email requis</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'rgb(50,50,50)' }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", { required: true })}
                                        className={`w-full pl-10 pr-12 py-3 rounded-2xl bg-white border-2 transition-all duration-300 ${errors.password
                                            ? 'border-red-400 ring-2 ring-red-100'
                                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            } focus:outline-none`}
                                        placeholder="••••••••"
                                        style={{ color: 'rgb(0,0,0)' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                                        style={{ color: 'rgb(50,50,50)' }}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">Mot de passe requis</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 rounded-2xl font-bold text-white shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                                style={{
                                    background: loading
                                        ? `linear-gradient(135deg, rgb(50,50,50) 0%, rgb(25,42,86) 100%)`
                                        : `linear-gradient(135deg, rgb(0,66,140) 0%, rgb(0,117,73) 50%, rgb(199,132,0) 100%)`,
                                    boxShadow: '0 15px 35px rgba(0,66,140,0.4)',
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                {loading ? (
                                    <div className="flex items-center justify-center relative z-10">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Connexion...
                                    </div>
                                ) : (
                                    <span className="relative z-10">Se connecter</span>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm" style={{ color: 'rgb(50,50,50)' }}>
                                Pas encore de compte ?{' '}
                                <a
                                    href="/register"
                                    className="font-bold transition-colors duration-200 hover:underline"
                                    style={{
                                        color: 'rgb(0,66,140)',
                                    }}
                                >
                                    Créer un compte
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
