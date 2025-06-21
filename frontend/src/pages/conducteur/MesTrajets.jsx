// src/pages/conducteur/MesTrajets.jsx
import React, { useState, useEffect } from "react";
import { X, Menu, Truck, MapPin, Calendar, Clock, Package, User, Phone, Mail, Navigation, CheckCircle, Edit, Eye, CheckSquare } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";
import axios from "axios";
import { toast } from 'react-hot-toast';

const MesTrajets = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [annonces, setAnnonces] = useState([]);
    const [trajetsByAnnonce, setTrajetsByAnnonce] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    useEffect(() => {
        const fetchAnnoncesAndTrajets = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/annonces/mine?page=1&limit=100', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const annoncesData = (response.data.data?.annonces || response.data.annonces || []);
                setAnnonces(annoncesData);
                // Fetch trajets for each annonce
                const trajetResults = await Promise.all(
                    annoncesData.map(async (annonce) => {
                        try {
                            const trajetRes = await axios.get(`http://localhost:5000/api/trajets/annonce/${annonce._id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            return { annonceId: annonce._id, trajet: trajetRes.data.data };
                        } catch (err) {
                            return { annonceId: annonce._id, trajet: null };
                        }
                    })
                );
                const trajetsMap = {};
                trajetResults.forEach(({ annonceId, trajet }) => {
                    trajetsMap[annonceId] = trajet;
                });
                setTrajetsByAnnonce(trajetsMap);
            } catch (err) {
                setError('Erreur lors du chargement des annonces ou trajets.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnnoncesAndTrajets();
    }, []);

    const filters = [
        { value: "all", label: "Tous", icon: Truck },
        { value: "en_cours", label: "En Cours", icon: Navigation },
        { value: "confirme", label: "Confirmés", icon: CheckCircle },
        { value: "en_attente", label: "En Attente", icon: Clock },
        { value: "termine", label: "Terminés", icon: CheckCircle }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "en_cours":
                return "bg-blue-100 text-blue-700";
            case "confirme":
                return "bg-green-100 text-green-700";
            case "en_attente":
                return "bg-yellow-100 text-yellow-700";
            case "termine":
                return "bg-gray-100 text-gray-700";
            case "annule":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "en_cours":
                return "En Cours";
            case "confirme":
                return "Confirmé";
            case "en_attente":
                return "En Attente";
            case "termine":
                return "Terminé";
            case "annule":
                return "Annulé";
            default:
                return status;
        }
    };

    const filteredTrips = annonces.map(annonce => ({
        id: annonce._id,
        from: annonce.lieuDepart?.nom || '',
        to: annonce.destination?.nom || '',
        date: annonce.dateDepart ? new Date(annonce.dateDepart).toLocaleDateString('fr-FR') : '',
        time: annonce.dateDepart ? new Date(annonce.dateDepart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
        status: annonce.statut || 'active',
        cargo: annonce.typeMarchandise || '',
        weight: annonce.poidsMaximum ? `${annonce.poidsMaximum} kg` : '',
        customer: annonce.conducteurId?.nom ? `${annonce.conducteurId.prenom} ${annonce.conducteurId.nom}` : '',
        price: annonce.prix || '',
        distance: '', // You can calculate or add this if available
        raw: annonce // keep the full annonce for modal/details if needed
    }));

    const handleTrajetAction = async (annonceId, action) => {
        try {
            const token = localStorage.getItem('token');
            // 1. Get the trajet by annonceId
            const trajetRes = await axios.get(`http://localhost:5000/api/trajets/annonce/${annonceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const trajetId = trajetRes.data.data._id;
            // 2. Call the action on the trajet
            let url = `http://localhost:5000/api/trajets/${trajetId}`;
            let method = 'post';
            if (action === 'suivre') {
                url += '/suivre';
                method = 'get';
            } else {
                url += `/${action}`;
            }
            const response = await axios({
                url,
                method,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (action === 'suivre') {
                toast.success('Position récupérée!');
            } else {
                toast.success(response.data.message || 'Action réussie!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'action');
        }
    };

    const handleMarkAsComplete = async (annonceId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/annonces/${annonceId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Annonce marquée comme terminée avec succès!');
                // Refresh the annonces list to show updated status
                const updatedAnnonces = annonces.map(annonce =>
                    annonce._id === annonceId
                        ? { ...annonce, statut: 'complete', dateArrivee: new Date() }
                        : annonce
                );
                setAnnonces(updatedAnnonces);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la finalisation de l\'annonce');
        }
    };

    const TripDetailsModal = ({ trip, onClose }) => {
        if (!trip) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Détails du Trajet</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MapPin className="text-blue-600" size={20} />
                                        <span className="font-semibold text-gray-800">Départ</span>
                                    </div>
                                    <p className="text-gray-600">{trip.from} → {trip.to}</p>
                                </div>
                                <div className="text-gray-400">
                                    <Navigation size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MapPin className="text-green-600" size={20} />
                                        <span className="font-semibold text-gray-800">Arrivée</span>
                                    </div>
                                    <p className="text-gray-600">{trip.to}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Informations du Trajet</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Date: {trip.date}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Heure: {trip.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Package className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Marchandise: {trip.cargo}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Truck className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Poids: {trip.weight}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Navigation className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Distance: {trip.distance}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Informations Client</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <User className="text-gray-400" size={16} />
                                        <span className="text-gray-600">{trip.customer}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="text-gray-400" size={16} />
                                        <span className="text-gray-600">+212 6 12 34 56 78</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="text-gray-400" size={16} />
                                        <span className="text-gray-600">fatima.zahra@email.com</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-3">Prix</h3>
                                    <div className="text-2xl font-bold text-green-600">
                                        {trip.price} MAD
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => handleTrajetAction(trip.raw._id, 'commencer')}>
                                Commencer
                            </button>
                            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors" onClick={() => handleTrajetAction(trip.raw._id, 'terminer')}>
                                Terminer
                            </button>
                            <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2" onClick={() => handleMarkAsComplete(trip.raw._id)}>
                                <CheckSquare size={16} />
                                <span>Marquer Terminé</span>
                            </button>
                            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors" onClick={() => handleTrajetAction(trip.raw._id, 'annuler')}>
                                Annuler
                            </button>
                            <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors" onClick={() => handleTrajetAction(trip.raw._id, 'suivre')}>
                                Suivre
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Chargement des trajets...</div>;
    }
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    if (annonces.length === 0) {
        return <div className="text-center py-10 text-gray-400">Aucun trajet disponible.</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <main
                className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
                    }`}
            >
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
                        Mes Trajets
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Mes Trajets</h1>
                        <div className="text-sm text-gray-600">
                            {annonces.length} trajet{annonces.length > 1 ? 's' : ''} trouvé{annonces.length > 1 ? 's' : ''}
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedFilter(filter.value)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedFilter === filter.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-4">
                        {annonces.map((annonce) => {
                            const trajet = trajetsByAnnonce[annonce._id];
                            return (
                                <div key={annonce._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-gray-800 font-semibold">
                                            <MapPin className="mr-2 text-blue-600" size={20} />
                                            {(annonce.lieuDepart?.nom || annonce.lieuDepart) + ' → ' + (annonce.destination?.nom || annonce.destination)}
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(annonce.statut)}`}>
                                            {getStatusText(annonce.statut)}
                                        </span>
                                    </div>
                                    <div className="mb-2 text-sm text-gray-600">
                                        Départ: {annonce.dateDepart ? new Date(annonce.dateDepart).toLocaleDateString('fr-FR') : ''}<br />
                                        Arrivée: {annonce.dateArrivee ? new Date(annonce.dateArrivee).toLocaleDateString('fr-FR') : ''}<br />
                                        Marchandise: {annonce.typeMarchandise}<br />
                                        Poids max: {annonce.poidsMaximum} kg<br />
                                        Prix: {annonce.prix} MAD
                                    </div>

                                    {/* Action buttons for all announcements */}
                                    <div className="mt-4">
                                        <div className="flex space-x-2 flex-wrap">
                                            {/* Mark as Complete button - always visible for active announcements */}
                                            {annonce.statut === 'active' && (
                                                <button
                                                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 hover:bg-purple-700 transition-colors"
                                                    onClick={() => handleMarkAsComplete(annonce._id)}
                                                >
                                                    <CheckSquare size={14} />
                                                    <span>Marquer Terminé</span>
                                                </button>
                                            )}

                                            {/* Trajet-specific buttons - only if trajet exists */}
                                            {trajet && (
                                                <>
                                                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => handleTrajetAction(annonce._id, 'commencer')}>Commencer</button>
                                                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => handleTrajetAction(annonce._id, 'terminer')}>Terminer</button>
                                                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm" onClick={() => handleTrajetAction(annonce._id, 'annuler')}>Annuler</button>
                                                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm" onClick={() => handleTrajetAction(annonce._id, 'suivre')}>Suivre</button>
                                                </>
                                            )}
                                        </div>

                                        {trajet ? (
                                            <div className="text-green-700 font-semibold mt-2">Trajet: {trajet.statut}</div>
                                        ) : (
                                            <div className="text-yellow-600 font-semibold mt-2">Trajet non démarré</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {selectedTrip && (
                <TripDetailsModal
                    trip={selectedTrip}
                    onClose={() => setSelectedTrip(null)}
                />
            )}
        </div>
    );
};

export default MesTrajets;