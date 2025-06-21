import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { X, Menu, Package, Search, History, Star, TrendingUp, MapPin, Clock, Bell, DollarSign, User, Plus } from "lucide-react";
import Sidebar from "../../components/expediteur/SidebarExpediteur";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DashboardExpediteur = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState({
        totalDemandes: 0,
        activeDemandes: 0,
        completedDeliveries: 0,
        averageRating: 0,
        totalSpent: 0
    });
    const [recentDemandes, setRecentDemandes] = useState([]);
    const [recentAnnonces, setRecentAnnonces] = useState([]);

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

    // Fetch expediteur statistics
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch demandes
            const demandesResponse = await axios.get('http://localhost:5000/api/demandes/mine', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const demandes = demandesResponse.data.data?.demandes || demandesResponse.data.demandes || [];

            // Calculate statistics
            const totalDemandes = demandes.length;
            const activeDemandes = demandes.filter(d => d.statut === 'en_attente' || d.statut === 'acceptee' || d.statut === 'en_cours').length;
            const completedDeliveries = demandes.filter(d => d.statut === 'livree').length;
            const totalSpent = demandes
                .filter(d => d.statut === 'livree' && d.annonceId?.prix)
                .reduce((sum, d) => sum + (d.annonceId.prix || 0), 0);

            // Get recent demandes
            const recent = demandes
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setRecentDemandes(recent);
            setStats({
                totalDemandes,
                activeDemandes,
                completedDeliveries,
                averageRating: 4.2, // Placeholder - would need ratings API
                totalSpent
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Erreur lors du chargement des statistiques');
        }
    };

    // Fetch recent annonces
    const fetchRecentAnnonces = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/annonces?page=1&limit=3', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setRecentAnnonces(response.data.data?.annonces || response.data.annonces || []);
            }
        } catch (error) {
            console.error('Error fetching recent annonces:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchStats();
        fetchRecentAnnonces();
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />
                <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement du tableau de bord...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />

            <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                {/* Header */}
                <div className="bg-white/95 backdrop-blur-xl p-4 shadow-sm flex items-center justify-between border-b border-gray-200/50 sticky top-0 z-30">
                    <button
                        onClick={toggleSidebar}
                        className="group relative p-2 rounded-xl text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 transition-transform duration-300">
                            {sidebarOpen ? (
                                <X size={24} className="transform rotate-90 group-hover:rotate-0 transition-transform duration-300" />
                            ) : (
                                <Menu size={24} className="transform group-hover:scale-110 transition-transform duration-300" />
                            )}
                        </div>
                    </button>

                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Tableau de Bord Expéditeur
                    </h1>

                    <Link
                        to="/expediteur/notifications"
                        className="group relative p-2 rounded-xl text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <Bell size={24} className="group-hover:scale-110 transition-transform duration-300" />
                        </div>
                    </Link>
                </div>

                <div className="p-6">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-2">Bonjour, {userData?.prenom || 'Expéditeur'}!</h2>
                                <p className="text-green-100">Vous avez {stats.activeDemandes} demandes actives</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Demandes</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                        {stats.totalDemandes}
                                    </p>
                                    <p className="text-xs text-green-600 font-medium mt-1">+8% ce mois</p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-2xl group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                                    <Package className="text-green-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Demandes Actives</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                        {stats.activeDemandes}
                                    </p>
                                    <p className="text-xs text-blue-600 font-medium mt-1">En cours</p>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-2xl group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                                    <Clock className="text-blue-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Livraisons Terminées</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                                        {stats.completedDeliveries}
                                    </p>
                                    <p className="text-xs text-purple-600 font-medium mt-1">Réussies</p>
                                </div>
                                <div className="bg-purple-100 p-4 rounded-2xl group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                                    <TrendingUp className="text-purple-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Dépensé</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                                        {stats.totalSpent} MAD
                                    </p>
                                    <p className="text-xs text-yellow-600 font-medium mt-1">Ce mois</p>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-2xl group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                                    <DollarSign className="text-yellow-600" size={28} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Recent Demandes */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Demandes Récentes</h2>
                                <Link to="/expediteur/demandes" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentDemandes.length > 0 ? (
                                    recentDemandes.map((demande) => (
                                        <div key={demande._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Package className="text-green-600" size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {demande.annonceId?.lieuDepart?.nom || 'N/A'} → {demande.annonceId?.destination?.nom || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${demande.statut === 'livree' ? 'bg-green-100 text-green-700' :
                                                    demande.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                                                        demande.statut === 'acceptee' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {demande.statut}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Package className="mx-auto mb-2" size={24} />
                                        <p>Aucune demande récente</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Annonces */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Annonces Récentes</h2>
                                <Link to="/expediteur/search" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentAnnonces.length > 0 ? (
                                    recentAnnonces.map((annonce) => (
                                        <div key={annonce._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <MapPin className="text-blue-600" size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {annonce.lieuDepart?.nom || 'N/A'} → {annonce.destination?.nom || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {annonce.prix} MAD • {new Date(annonce.dateDepart).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                to="/expediteur/search"
                                                className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Demander
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <MapPin className="mx-auto mb-2" size={24} />
                                        <p>Aucune annonce récente</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Actions Rapides</h2>
                            <div className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full">
                                Accès direct
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link to="/expediteur/search" className="block group">
                                <div className="relative p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                                    <Search className="mx-auto mb-3 group-hover:animate-bounce relative z-10" size={32} />
                                    <span className="block text-lg font-bold relative z-10">Rechercher Transport</span>
                                    <span className="block text-sm opacity-90 mt-1 relative z-10">Trouver un transport</span>
                                </div>
                            </Link>

                            <Link to="/expediteur/demandes" className="block group">
                                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                                    <Package className="mx-auto mb-3 group-hover:animate-bounce relative z-10" size={32} />
                                    <span className="block text-lg font-bold relative z-10">Mes Demandes</span>
                                    <span className="block text-sm opacity-90 mt-1 relative z-10">Suivre mes demandes</span>
                                </div>
                            </Link>

                            <Link to="/expediteur/historique" className="block group">
                                <div className="relative p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                                    <History className="mx-auto mb-3 group-hover:animate-bounce relative z-10" size={32} />
                                    <span className="block text-lg font-bold relative z-10">Historique</span>
                                    <span className="block text-sm opacity-90 mt-1 relative z-10">Voir l'historique</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardExpediteur; 