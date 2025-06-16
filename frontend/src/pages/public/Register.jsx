import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await api.post('/auth/register', data);
            alert("Compte créé !");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Erreur");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-6 rounded-lg space-y-4 w-96">
                <h2 className="text-xl font-bold">Créer un compte</h2>
                <input {...register("nom")} placeholder="Nom" className="w-full p-2 bg-gray-700 rounded" />
                <input {...register("prenom")} placeholder="Prénom" className="w-full p-2 bg-gray-700 rounded" />
                <input {...register("email")} placeholder="Email" className="w-full p-2 bg-gray-700 rounded" />
                <input {...register("telephone")} placeholder="Téléphone" className="w-full p-2 bg-gray-700 rounded" />
                <input {...register("password")} type="password" placeholder="Mot de passe" className="w-full p-2 bg-gray-700 rounded" />
                <select {...register("role")} className="w-full p-2 bg-gray-700 rounded">
                    <option value="conducteur">Conducteur</option>
                    <option value="expediteur">Expéditeur</option>
                </select>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 p-2 rounded">S’inscrire</button>
            </form>
        </div>
    );
};

export default Register;
