import React, { useState, useEffect } from "react";
import { MapPin, CalendarDays, Truck, X, Menu, Star, Package, DollarSign, Clock, Filter, Search, User, CheckCircle, Truck as TruckIcon, Award, TrendingUp, XCircle, AlertCircle, Weight } from "lucide-react";
import Sidebar from "../../components/expediteur/SidebarExpediteur";
import axios from "axios";

const PackageHistory = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [stats, setStats] = useState({
        totalPackages: 0,
        totalSpent: 0,
        averageRating: 0,
        completedTrips: 0
    });
    const [ratingModal, setRatingModal] = useState({
        isOpen: false,
        demandeId: null,
        rating: 0,
        comment: ""
    });

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

    // Fetch package history
    const fetchPackageHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/demandes/mine', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const allDemandes = response.data.data?.demandes || response.data.demandes || [];
                console.log('All demandes from API:', allDemandes);

                // Filter for completed demandes (livree, refusee, annulee)
                const completedDemandes = allDemandes.filter(demande =>
                    demande.statut === 'livree' || demande.statut === 'refusee' || demande.statut === 'annulee'
                );
                console.log('Completed demandes:', completedDemandes);

                // Log the first demande structure if it exists
                if (completedDemandes.length > 0) {
                    console.log('First demande structure:', completedDemandes[0]);
                    console.log('AnnonceId structure:', completedDemandes[0].annonceId);
                }

                setHistory(completedDemandes);

                // Calculate statistics
                const totalSpent = completedDemandes
                    .filter(demande => demande.statut === 'livree')
                    .reduce((sum, demande) => sum + (demande.annonceId?.prix || 0), 0);

                const averageRating = completedDemandes.length > 0 ?
                    completedDemandes.reduce((sum, demande) =>
                        sum + (demande.rating || 0), 0
                    ) / completedDemandes.length : 0;

                setStats({
                    totalPackages: completedDemandes.length,
                    totalSpent,
                    averageRating: Math.round(averageRating * 10) / 10,
                    completedTrips: completedDemandes.filter(d => d.statut === 'livree').length
                });
            } else {
                setError('Erreur lors du chargement de l\'historique.');
            }
        } catch (err) {
            console.error("Error fetching package history:", err);
            setError('Erreur lors du chargement de l\'historique.');
        } finally {
            setLoading(false);
        }
    };

    // Rate a completed trip
    const handleRateTrip = async (demandeId, rating, comment) => {
        try {
            const token = localStorage.getItem('token');

            // Find the demande to get the conducteur ID from the annonce
            const demande = history.find(d => d._id === demandeId);
            console.log('Demande found:', demande);
            console.log('AnnonceId structure:', demande?.annonceId);

            if (!demande || !demande.annonceId || !demande.annonceId.conducteurId) {
                console.error('Invalid demande structure:', demande);
                throw new Error('Données de demande invalides - conducteurId manquant');
            }

            await axios.post(`http://localhost:5000/api/evaluations`, {
                evalueId: demande.annonceId.conducteurId._id, // ID of the conducteur being evaluated
                annonceId: demande.annonceId._id, // Using annonce ID for evaluation
                note: rating,
                commentaire: comment,
                type: 'expediteur_vers_conducteur'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setHistory(prev => prev.map(item =>
                item._id === demandeId
                    ? { ...item, rating, commentaire: comment }
                    : item
            ));

            // Close modal
            setRatingModal({
                isOpen: false,
                demandeId: null,
                rating: 0,
                comment: ""
            });

            alert('Évaluation envoyée avec succès!');
        } catch (err) {
            console.error("Error rating trip:", err);
            alert('Erreur lors de l\'envoi de l\'évaluation: ' + (err.response?.data?.message || err.message));
        }
    };

    const openRatingModal = (demandeId) => {
        setRatingModal({
            isOpen: true,
            demandeId,
            rating: 0,
            comment: ""
        });
    };

    const closeRatingModal = () => {
        setRatingModal({
            isOpen: false,
            demandeId: null,
            rating: 0,
            comment: ""
        });
    };

    const submitRating = () => {
        if (ratingModal.rating > 0) {
            handleRateTrip(ratingModal.demandeId, ratingModal.rating, ratingModal.comment);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchPackageHistory();
    }, []);

    const filters = [
        { value: "all", label: "Toutes", icon: Package },
        { value: "recent", label: "Récentes", icon: Clock },
        { value: "rated", label: "Évaluées", icon: Star },
        { value: "unrated", label: "Non évaluées", icon: Award }
    ];

    const getStatusColor = (statut) => {
        switch (statut) {
            case "livree":
                return "bg-green-100 text-green-700";
            case "refusee":
                return "bg-red-100 text-red-700";
            case "annulee":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-blue-100 text-blue-700";
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case "livree":
                return "Livré";
            case "refusee":
                return "Refusé";
            case "annulee":
                return "Annulé";
            default:
                return statut;
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesFilter = selectedFilter === "all" ||
            (selectedFilter === "recent" && new Date(item.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
            (selectedFilter === "rated" && item.rating) ||
            (selectedFilter === "unrated" && !item.rating);

        const matchesSearch = item.annonceId?.lieuDepart?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.annonceId?.destination?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.typeColis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />
                <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement de l'historique...</p>
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
                        Historique des Colis
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Historique des Colis</h1>

                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans l'historique..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto">
                                {filters.map((filter) => {
                                    const Icon = filter.icon;
                                    return (
                                        <button
                                            key={filter.value}
                                            onClick={() => setSelectedFilter(filter.value)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedFilter === filter.value
                                                ? "bg-green-600 text-white"
                                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                                }`}
                                        >
                                            <Icon size={16} />
                                            <span>{filter.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Colis</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalPackages}</p>
                                </div>
                                <Package className="text-blue-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Dépensé</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.totalSpent} MAD</p>
                                </div>
                                <DollarSign className="text-green-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Note Moyenne</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.averageRating}/5</p>
                                </div>
                                <Star className="text-yellow-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Trajets Complétés</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.completedTrips}</p>
                                </div>
                                <TruckIcon className="text-purple-500" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* History List */}
                    <div className="space-y-4">
                        {filteredHistory.map((item) => (
                            <div key={item._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.statut === 'livree' ? 'bg-green-100' :
                                            item.statut === 'refusee' ? 'bg-red-100' :
                                                'bg-gray-100'
                                            }`}>
                                            {item.statut === 'livree' ? (
                                                <CheckCircle className="text-green-600" size={24} />
                                            ) : item.statut === 'refusee' ? (
                                                <XCircle className="text-red-600" size={24} />
                                            ) : (
                                                <AlertCircle className="text-gray-600" size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {item.annonceId?.lieuDepart?.nom || item.annonceId?.lieuDepart} → {item.annonceId?.destination?.nom || item.annonceId?.destination}
                                            </h3>
                                            <p className="text-sm text-gray-600">{item.typeColis}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-600">{item.annonceId?.prix} MAD</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Weight className="mr-2 text-gray-500" size={16} />
                                        <span>{item.poids} kg</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="mr-2 text-gray-500" size={16} />
                                        <span>{item.annonceId?.conducteur?.prenom} {item.annonceId?.conducteur?.nom}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <CalendarDays className="mr-2 text-gray-500" size={16} />
                                        <span>
                                            {item.statut === 'livree' ? 'Livré le ' :
                                                item.statut === 'refusee' ? 'Refusé le ' :
                                                    item.statut === 'annulee' ? 'Annulé le ' : 'Créé le '}
                                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>

                                {item.description && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700">{item.description}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {item.rating ? (
                                            <div className="flex items-center space-x-1">
                                                <span className="text-sm text-gray-600">Votre note:</span>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openRatingModal(item._id)}
                                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                            >
                                                Évaluer
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">Statut: </span>
                                        <span className={`${getStatusColor(item.statut)} text-xs px-2 py-1 rounded-full font-medium`}>
                                            {getStatusText(item.statut)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredHistory.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun historique trouvé</h3>
                            <p className="text-gray-500">Vous n'avez pas encore de colis livrés</p>
                        </div>
                    )}
                </div>

                {/* Rating Modal */}
                {ratingModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Évaluer le transport</h3>
                                <button
                                    onClick={closeRatingModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note (1-5 étoiles)
                                </label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRatingModal(prev => ({ ...prev, rating: star }))}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                className={`${star <= ratingModal.rating
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                                    } hover:text-yellow-400 transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Commentaire (optionnel)
                                </label>
                                <textarea
                                    value={ratingModal.comment}
                                    onChange={(e) => setRatingModal(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Partagez votre expérience..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={closeRatingModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={submitRating}
                                    disabled={ratingModal.rating === 0}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PackageHistory;
