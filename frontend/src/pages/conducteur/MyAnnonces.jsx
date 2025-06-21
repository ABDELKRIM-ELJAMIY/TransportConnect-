// src/pages/conducteur/MyAnnonces.jsx
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

import { MapPin, CalendarDays, Package, Weight, Truck, BadgeCheck, X, Menu, Edit, Trash2 } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const MyAnnonces = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data.user);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    useEffect(() => {
        const fetchAnnonces = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/annonces/mine?page=1&limit=10', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnnonces(
                    (response.data.data?.annonces || response.data.annonces || [])
                        .filter(a => a.statut !== 'annulee')
                );
            } catch (err) {
                setError('Erreur lors du chargement des annonces.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchAnnonces();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/annonces/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnonces(prev => prev.filter(a => (a.id || a._id) !== id));
        } catch (err) {
            setError('Erreur lors de la suppression de l\'annonce.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />

            <main
                className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
                    }`}
            >
                {/* Fixed Header */}
                <div className="bg-white/95 backdrop-blur-xl p-4 shadow-sm flex items-center justify-between border-b border-gray-200/50 sticky top-0 z-30">
                    <button
                        onClick={toggleSidebar}
                        className="group relative p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 transition-transform duration-300">
                            {sidebarOpen ? (
                                <X size={24} className="transform rotate-90 group-hover:rotate-0 transition-transform duration-300" />
                            ) : (
                                <Menu size={24} className="transform group-hover:scale-110 transition-transform duration-300" />
                            )}
                        </div>
                    </button>

                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Mes Annonces
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Mes Annonces</h1>
                        <Link to="/conducteur/CreerAnnonce">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Nouvelle Annonce
                            </button>
                        </Link>

                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Chargement des annonces...</div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {annonces.length === 0 ? (
                                <div className="col-span-full text-center text-gray-400">Aucune annonce trouvée.</div>
                            ) : annonces.map((annonce) => (
                                <div key={annonce.id || annonce._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-gray-800 font-semibold">
                                            <MapPin className="mr-2 text-blue-600" size={20} />
                                            {(annonce.lieuDepart?.nom || annonce.lieuDepart) + ' → ' + (annonce.destination?.nom || annonce.destination)}
                                        </div>
                                        <span
                                            className={`text-sm px-2 py-1 rounded-full font-medium ${annonce.statut === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {annonce.statut}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                        <p className="flex items-center">
                                            <CalendarDays className="mr-2 text-gray-500" size={18} />
                                            Départ: {annonce.dateDepart ? new Date(annonce.dateDepart).toLocaleDateString('fr-FR') : ''}
                                        </p>
                                        <p className="flex items-center">
                                            <CalendarDays className="mr-2 text-gray-500" size={18} />
                                            Arrivée: {annonce.dateArrivee ? new Date(annonce.dateArrivee).toLocaleDateString('fr-FR') : ''}
                                        </p>
                                        <p className="flex items-center">
                                            <Package className="mr-2 text-gray-500" size={18} />
                                            Marchandise: {annonce.typeMarchandise}
                                        </p>
                                        <p className="flex items-center">
                                            <Weight className="mr-2 text-gray-500" size={18} />
                                            Poids max: {annonce.poidsMaximum} kg
                                        </p>
                                        <p className="flex items-center">
                                            <Truck className="mr-2 text-gray-500" size={18} />
                                            Prix: {annonce.prix} MAD
                                        </p>
                                        <p className="flex items-center">
                                            <BadgeCheck className="mr-2 text-gray-500" size={18} />
                                            Places dispo: {annonce.nombrePlacesDisponibles}
                                        </p>
                                        <p className="flex items-center">
                                            <span className="mr-2 font-bold">Urgent:</span> {annonce.isUrgent ? 'Oui' : 'Non'}
                                        </p>
                                        <p className="flex items-center">
                                            <span className="mr-2 font-bold">Dimensions:</span>
                                            {annonce.dimensions ? `${annonce.dimensions.longueurMax}m x ${annonce.dimensions.largeurMax}m x ${annonce.dimensions.hauteurMax}m` : 'N/A'}
                                        </p>
                                    </div>
                                    {/* Etapes Intermediaires */}
                                    {annonce.etapesIntermediaires && annonce.etapesIntermediaires.length > 0 && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-gray-700">Étapes intermédiaires :</span>
                                            <ul className="list-disc list-inside ml-4 text-gray-600">
                                                {annonce.etapesIntermediaires.map((etape, i) => (
                                                    <li key={i}>
                                                        {etape.nom}
                                                        {etape.adresse ? `, ${etape.adresse}` : ''}
                                                        {etape.latitude && etape.longitude ? ` (${etape.latitude}, ${etape.longitude})` : ''}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Conditions */}
                                    {annonce.conditions && (
                                        <div className="mb-2 text-xs text-gray-500">
                                            <span className="font-semibold">Conditions: </span>
                                            {annonce.conditions.accepteAnimaux && 'Animaux acceptés. '}
                                            {annonce.conditions.fumeurAccepte && 'Fumeur accepté. '}
                                            {annonce.conditions.conditionsSpeciales && `Spécial: ${annonce.conditions.conditionsSpeciales}`}
                                        </div>
                                    )}
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <Link to={`/conducteur/edit-annonce/${annonce._id || annonce.id}`}>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                        </Link>
                                        <button
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            onClick={() => handleDelete(annonce.id || annonce._id)}
                                            disabled={loading}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyAnnonces;
