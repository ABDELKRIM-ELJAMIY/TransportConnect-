import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Truck, Eye, EyeOff, User, Mail, Phone, Lock, ChevronDown, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Yup validation schema
const schema = yup.object().shape({
    prenom: yup.string()
        .required('Le prénom est requis')
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'),
    nom: yup.string()
        .required('Le nom est requis')
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),
    email: yup.string()
        .email('Email invalide')
        .required('Email requis')
        .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
    telephone: yup.string()
        .required('Téléphone requis')
        .matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Format de numéro de téléphone français invalide (ex: 0612345678 ou +33612345678)'),
    password: yup.string()
        .required('Mot de passe requis')
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&)'
        ),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
        .required('Confirmation du mot de passe requise'),
    role: yup.string()
        .oneOf(['conducteur', 'expediteur'], 'Le rôle doit être conducteur ou expediteur')
        .required('Rôle requis'),
});

// Debounce utility function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSubmitTime, setLastSubmitTime] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            prenom: '',
            nom: '',
            email: '',
            telephone: '',
            password: '',
            confirmPassword: '',
            role: 'expediteur',
        },
    });

    const submitForm = async (data) => {
        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTime;

        // Prevent submissions within 2 seconds
        if (timeSinceLastSubmit < 2000) {
            toast.error('Veuillez attendre avant de soumettre à nouveau');
            return;
        }

        setIsSubmitting(true);
        setLastSubmitTime(now);

        try {
            // Add request timeout and retry logic
            const response = await axios.post('http://localhost:5000/api/auth/register', data, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Compte créé avec succès ! Redirection vers la page de connexion...', {
                duration: 4000,
                icon: '🎉',
            });

            reset();

            // Wait 2 seconds before redirecting to let user see the success message
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);

            if (error.response?.status === 429) {
                toast.error('Trop de tentatives. Veuillez attendre quelques minutes avant de réessayer.');
            } else if (error.code === 'ECONNABORTED') {
                toast.error('Délai d\'attente dépassé. Veuillez réessayer.');
            } else {
                const errorMsg = error.response?.data?.message || error.message || 'Erreur de création de compte';
                toast.error(errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Debounced submit function
    const debouncedSubmit = useCallback(
        debounce(submitForm, 1000), // 1 second debounce
        [lastSubmitTime]
    );

    const onSubmit = (data) => {
        if (isSubmitting) return; // Prevent double submission
        debouncedSubmit(data);
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
                            <p className="text-white/90 text-sm font-medium">Créez votre compte professionnel</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                            {/* Prénom + Nom */}
                            <div className="grid grid-cols-2 gap-4">
                                {['prenom', 'nom'].map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                            {field === 'prenom' ? 'Prénom' : 'Nom'}
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'rgb(50,50,50)' }} />
                                            <input
                                                type="text"
                                                {...register(field)}
                                                placeholder={`Votre ${field}`}
                                                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 transition-all duration-300 ${errors[field]
                                                    ? 'border-red-400 ring-2 ring-red-100'
                                                    : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                    } focus:outline-none`}
                                                style={{ color: 'rgb(0,0,0)' }}
                                            />
                                        </div>
                                        {errors[field] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[field].message}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                    Email professionnel
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'rgb(50,50,50)' }} />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        placeholder="email@exemple.com"
                                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 transition-all duration-300 ${errors.email
                                            ? 'border-red-400 ring-2 ring-red-100'
                                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            } focus:outline-none`}
                                        style={{ color: 'rgb(0,0,0)' }}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                    Téléphone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'rgb(50,50,50)' }} />
                                    <input
                                        type="tel"
                                        {...register('telephone')}
                                        placeholder="06 12 34 56 78"
                                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 transition-all duration-300 ${errors.telephone
                                            ? 'border-red-400 ring-2 ring-red-100'
                                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            } focus:outline-none`}
                                        style={{ color: 'rgb(0,0,0)' }}
                                    />
                                </div>
                                {errors.telephone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.telephone.message}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'rgb(50,50,50)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-12 py-3 rounded-2xl bg-white border-2 transition-all duration-300 ${errors.password
                                            ? 'border-red-400 ring-2 ring-red-100'
                                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            } focus:outline-none`}
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
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'rgb(50,50,50)' }} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-12 py-3 rounded-2xl bg-white border-2 transition-all duration-300 ${errors.confirmPassword
                                            ? 'border-red-400 ring-2 ring-red-100'
                                            : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            } focus:outline-none`}
                                        style={{ color: 'rgb(0,0,0)' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                                        style={{ color: 'rgb(50,50,50)' }}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(25,42,86)' }}>
                                    Vous êtes
                                </label>
                                <div className="relative">
                                    <select
                                        {...register('role')}
                                        className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white border-2 border-gray-200 appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:border-blue-300"
                                        style={{ color: 'rgb(0,0,0)' }}
                                    >
                                        <option value="conducteur">Conducteur</option>
                                        <option value="expediteur">Expéditeur</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'rgb(50,50,50)' }} />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 rounded-2xl font-bold text-white shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                                style={{
                                    background: isSubmitting
                                        ? `linear-gradient(135deg, rgb(50,50,50) 0%, rgb(25,42,86) 100%)`
                                        : `linear-gradient(135deg, rgb(0,66,140) 0%, rgb(0,117,73) 50%, rgb(199,132,0) 100%)`,
                                    boxShadow: '0 15px 35px rgba(0,66,140,0.4)',
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center relative z-10">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Création en cours...
                                    </div>
                                ) : (
                                    <span className="relative z-10">Créer mon compte</span>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm" style={{ color: 'rgb(50,50,50)' }}>
                                Déjà un compte ?{' '}
                                <button
                                    onClick={() => console.log('Navigate to login')}
                                    className="font-bold transition-colors duration-200 hover:underline"
                                    style={{
                                        color: 'rgb(0,66,140)',
                                    }}
                                >
                                    Se connecter
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;