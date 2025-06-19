// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { X, Menu, Truck, Package, Users, TrendingUp, MapPin, Clock, Star, Bell } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalTrips: 0,
        activeRequests: 0,
        completedDeliveries: 0,
        averageRating: 0
    });
    const [recentTrips, setRecentTrips] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Erreur lors du chargement du profil');
        }
    };

    // Fetch driver's transport offers
    const fetchMyAnnonces = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/annonces/mine', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const annonces = response.data;
            setRecentTrips(annonces.slice(0, 3).map(annonce => ({
                id: annonce._id,
                from: annonce.lieuDepart?.nom || 'N/A',
                to: annonce.destination?.nom || 'N/A',
                date: new Date(annonce.dateDepart).toLocaleDateString('fr-FR'),
                status: annonce.status || 'Active',
                cargo: annonce.typeMarchandise || 'N/A',
                rating: annonce.rating || null
            })));

            // Calculate stats
            const totalTrips = annonces.length;
            const completedDeliveries = annonces.filter(a => a.status === 'completed').length;

            setStats(prev => ({
                ...prev,
                totalTrips,
                completedDeliveries
            }));

            // Fetch requests for each annonce
            await fetchRequestsForAnnonces(annonces);
        } catch (error) {
            console.error('Error fetching annonces:', error);
            toast.error('Erreur lors du chargement des annonces');
        }
    };

    // Fetch requests for driver's offers
    const fetchRequestsForAnnonces = async (annonces) => {
        try {
            const token = localStorage.getItem('token');
            let allRequests = [];
            let activeRequestsCount = 0;

            for (const annonce of annonces) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/demandes/annonce/${annonce._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const requests = response.data.filter(req => req.status === 'pending');
                    activeRequestsCount += requests.length;

                    allRequests.push(...requests.map(req => ({
                        id: req._id,
                        shipper: req.expediteur?.prenom + ' ' + req.expediteur?.nom || 'N/A',
                        from: annonce.lieuDepart?.nom || 'N/A',
                        to: annonce.destination?.nom || 'N/A',
                        cargo: req.typeMarchandise || 'N/A',
                        weight: req.poids + ' kg' || 'N/A',
                        requestDate: new Date(req.dateCreation).toLocaleDateString('fr-FR'),
                        annonceId: annonce._id
                    })));
                } catch (error) {
                    console.error(`Error fetching requests for annonce ${annonce._id}:`, error);
                }
            }

            setPendingRequests(allRequests.slice(0, 5)); // Show only first 5 requests
            setStats(prev => ({
                ...prev,
                activeRequests: activeRequestsCount
            }));
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    // Fetch user evaluations for average rating
    const fetchUserEvaluations = async () => {
        try {
            const token = localStorage.getItem('token');
            const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userId = userResponse.data.user.id;
            const response = await axios.get(`http://localhost:5000/api/evaluations/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const evaluations = response.data;
            if (evaluations.length > 0) {
                const averageRating = evaluations.reduce((sum, evaluation) => sum + evaluation.note, 0) / evaluations.length;
                setStats(prev => ({
                    ...prev,
                    averageRating: Math.round(averageRating * 10) / 10
                }));
            }
        } catch (error) {
            console.error('Error fetching evaluations:', error);
        }
    };

    // Handle request status update
    const handleRequestStatus = async (requestId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/demandes/${requestId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(`Demande ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès`);

            // Refresh data
            await fetchMyAnnonces();
        } catch (error) {
            console.error('Error updating request status:', error);
            toast.error('Erreur lors de la mise à jour du statut');
        }
    };

    // Load all data on component mount
    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchUserProfile(),
                    fetchMyAnnonces(),
                    fetchUserEvaluations()
                ]);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                toast.error('Erreur lors du chargement du tableau de bord');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement du tableau de bord...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

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
                        Tableau de Bord Conducteur
                    </h1>

                    <Link
                        to="/conducteur/notifications"
                        className="group relative p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 transition-transform duration-300">
                            <Bell size={24} className="transform group-hover:scale-110 transition-transform duration-300" />
                            {stats.activeRequests > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                    {stats.activeRequests > 9 ? '9+' : stats.activeRequests}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="p-6">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-2">Bonjour, {user?.prenom || 'Conducteur'}!</h2>
                                <p className="text-blue-100">Vous avez {stats.activeRequests} nouvelles demandes en attente</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Trajets Totaux</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                        {stats.totalTrips}
                                    </p>
                                    <p className="text-xs text-green-600 font-medium mt-1">+12% ce mois</p>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-2xl group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                                    <Truck className="text-blue-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Demandes Actives</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                                        {stats.activeRequests}
                                    </p>
                                    <p className="text-xs text-orange-600 font-medium mt-1">En attente</p>
                                </div>
                                <div className="bg-orange-100 p-4 rounded-2xl group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
                                    <Package className="text-orange-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Livraisons Complétées</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                        {stats.completedDeliveries}
                                    </p>
                                    <p className="text-xs text-green-600 font-medium mt-1">+8% ce mois</p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-2xl group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                                    <TrendingUp className="text-green-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-200 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Note Moyenne</p>
                                    <p className="text-3xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                                        {stats.averageRating || 'N/A'}
                                    </p>
                                    <p className="text-xs text-yellow-600 font-medium mt-1">⭐ Excellent</p>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-2xl group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                                    <Star className="text-yellow-600" size={28} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Trips */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-xl mr-3">
                                        <Clock className="text-blue-600" size={20} />
                                    </div>
                                    Trajets Récents
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {recentTrips.length > 0 ? (
                                        recentTrips.map((trip) => (
                                            <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer">
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                                                        <MapPin className="text-blue-600" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                                            {trip.from} → {trip.to}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {trip.cargo} • {trip.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${trip.status === 'Completed'
                                                        ? 'bg-green-100 text-green-800 group-hover:bg-green-200'
                                                        : 'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
                                                        }`}>
                                                        {trip.status}
                                                    </span>
                                                    {trip.rating && (
                                                        <div className="flex items-center mt-2 justify-end">
                                                            <Star className="text-yellow-500 fill-current" size={16} />
                                                            <span className="text-sm text-gray-600 ml-1 font-medium">{trip.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Truck className="mx-auto mb-2" size={32} />
                                            <p>Aucun trajet récent</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <Link to="/conducteur/MesTrajets" className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm hover:bg-blue-50 py-2 rounded-xl transition-all duration-300 block text-center">
                                        Voir tous les trajets →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Pending Requests */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <div className="bg-orange-100 p-2 rounded-xl mr-3">
                                        <Users className="text-orange-600" size={20} />
                                    </div>
                                    Demandes en Attente
                                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {pendingRequests.length}
                                    </span>
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {pendingRequests.length > 0 ? (
                                        pendingRequests.map((request) => (
                                            <div key={request.id} className="p-4 border-2 border-gray-200 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all duration-300 group">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                                                        {request.shipper}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                                        {request.requestDate}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-700 mb-4">
                                                    <div className="flex items-center">
                                                        <MapPin size={14} className="text-gray-400 mr-2" />
                                                        <span><strong>Trajet:</strong> {request.from} → {request.to}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Package size={14} className="text-gray-400 mr-2" />
                                                        <span><strong>Marchandise:</strong> {request.cargo}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <TrendingUp size={14} className="text-gray-400 mr-2" />
                                                        <span><strong>Poids:</strong> {request.weight}</span>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleRequestStatus(request.id, 'accepted')}
                                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                    >
                                                        Accepter
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestStatus(request.id, 'rejected')}
                                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                    >
                                                        Refuser
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Package className="mx-auto mb-2" size={32} />
                                            <p>Aucune demande en attente</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Actions Rapides</h2>
                            <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                                Accès direct
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link to="/conducteur/CreerAnnonce" className="block group">
                                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                                    <Truck className="mx-auto mb-3 group-hover:animate-bounce relative z-10" size={32} />
                                    <span className="block text-lg font-bold relative z-10">Créer une Annonce</span>
                                    <span className="block text-sm opacity-90 mt-1 relative z-10">Publier un nouveau trajet</span>
                                </div>
                            </Link>

                            <Link to="/conducteur/MyAnnonces" className="block group">
                                <div className="relative p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                                    <Package className="mx-auto mb-3 group-hover:animate-bounce relative z-10" size={32} />
                                    <span className="block text-lg font-bold relative z-10">Mes Annonces</span>
                                    <span className="block text-sm opacity-90 mt-1 relative z-10">Gérer mes trajets actifs</span>
                                </div>
                            </Link>

                            <Link to="/conducteur/Historique" className="group block">
                                <div className="relative p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                                    <Users className="mx-auto mb-3 group-hover:animate-bounce relative z-10" size={32} />
                                    <span className="block text-lg font-bold relative z-10">Historique</span>
                                    <span className="block text-sm opacity-90 mt-1 relative z-10">Voir l'historique complet</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;