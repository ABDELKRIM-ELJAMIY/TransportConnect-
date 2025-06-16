import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await api.post('/auth/login', data);
            localStorage.setItem('token', res.data.token);
            alert("Connexion réussie");
            // Rediriger selon le rôle
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erreur");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-6 rounded-lg space-y-4 w-96">
                <h2 className="text-xl font-bold">Connexion</h2>
                <input {...register("email")} placeholder="Email" className="w-full p-2 bg-gray-700 rounded" />
                <input {...register("password")} type="password" placeholder="Mot de passe" className="w-full p-2 bg-gray-700 rounded" />
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 p-2 rounded">Se connecter</button>
            </form>
        </div>
    );
};

export default Login;
