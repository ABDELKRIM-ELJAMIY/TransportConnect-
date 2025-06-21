import React, { useState, useEffect } from "react";
import { MapPin, CalendarDays, Truck, X, Menu, Star, Package, DollarSign, Clock, Filter, Search, User, CheckCircle, XCircle, AlertCircle, Phone, Mail, Scale } from "lucide-react";
import Sidebar from "../../components/expediteur/SidebarExpediteur";
import axios from "axios";

const MyDemandes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

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

    // Fetch user's transport requests
    const fetchDemandes = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/demandes/mine', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const allDemandes = response.data.data?.demandes || response.data.demandes || [];
                // Filter out completed demandes (livree, refusee) - they go to historique
                const activeDemandes = allDemandes.filter(demande =>
                    demande.statut !== 'livree' && demande.statut !== 'refusee'
                );
                console.log('Fetched active demandes:', activeDemandes);
                setDemandes(activeDemandes);
            } else {
                setError('Erreur lors du chargement des demandes.');
            }
        } catch (err) {
            console.error("Error fetching demandes:", err);
            setError('Erreur lors du chargement des demandes.');
        } finally {
            setLoading(false);
        }
    };

    // Cancel a request
    const handleCancelRequest = async (demandeId) => {
        if (!window.confirm('Voulez-vous vraiment annuler cette demande ?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/demandes/${demandeId}/status`,
                { status: 'annulee' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setDemandes(prev => prev.map(demande =>
                demande._id === demandeId
                    ? { ...demande, statut: 'annulee' }
                    : demande
            ));

            alert('Demande annulée avec succès!');
        } catch (err) {
            console.error("Error cancelling request:", err);
            alert('Erreur lors de l\'annulation de la demande.');
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchDemandes();
    }, []);

    const filters = [
        { value: "all", label: "Toutes", icon: Package },
        { value: "en_attente", label: "En attente", icon: Clock },
        { value: "acceptee", label: "Acceptées", icon: CheckCircle },
        { value: "refusee", label: "Refusées", icon: XCircle },
        { value: "annulee", label: "Annulées", icon: AlertCircle }
    ];

    const getStatusColor = (statut) => {
        switch (statut) {
            case "en_attente":
                return "bg-yellow-100 text-yellow-700";
            case "acceptee":
                return "bg-green-100 text-green-700";
            case "en_cours":
                return "bg-blue-100 text-blue-700";
            case "livree":
                return "bg-purple-100 text-purple-700";
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
            case "en_attente":
                return "En attente";
            case "acceptee":
                return "Acceptée";
            case "en_cours":
                return "En cours";
            case "livree":
                return "Livrée";
            case "refusee":
                return "Refusée";
            case "annulee":
                return "Annulée";
            default:
                return statut;
        }
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case "en_attente":
                return Clock;
            case "acceptee":
                return CheckCircle;
            case "en_cours":
                return Truck;
            case "livree":
                return CheckCircle;
            case "refusee":
                return XCircle;
            case "annulee":
                return AlertCircle;
            default:
                return Package;
        }
    };

    const filteredDemandes = demandes.filter(demande => {
        const matchesFilter = selectedFilter === "all" || demande.statut === selectedFilter;
        const matchesSearch = demande.annonceId?.lieuDepart?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.annonceId?.destination?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.typeColis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
                            <p className="text-gray-600">Chargement des demandes...</p>
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
                        Mes Demandes de Transport
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes Demandes de Transport</h1>

                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans mes demandes..."
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
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-800">{demandes.length}</p>
                                </div>
                                <Package className="text-blue-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">En attente</p>
                                    <p className="text-2xl font-bold text-yellow-600">{demandes.filter(d => d.statut === 'en_attente').length}</p>
                                </div>
                                <Clock className="text-yellow-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Acceptées</p>
                                    <p className="text-2xl font-bold text-green-600">{demandes.filter(d => d.statut === 'acceptee').length}</p>
                                </div>
                                <CheckCircle className="text-green-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Refusées</p>
                                    <p className="text-2xl font-bold text-red-600">{demandes.filter(d => d.statut === 'refusee').length}</p>
                                </div>
                                <XCircle className="text-red-500" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Demandes List */}
                    <div className="space-y-4">
                        {filteredDemandes.map((demande) => {
                            const StatusIcon = getStatusIcon(demande.statut);
                            return (
                                <div key={demande._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${demande.statut === "en_attente" ? "bg-yellow-100" :
                                                demande.statut === "acceptee" ? "bg-green-100" :
                                                    demande.statut === "en_cours" ? "bg-blue-100" :
                                                        demande.statut === "livree" ? "bg-purple-100" :
                                                            demande.statut === "refusee" ? "bg-red-100" :
                                                                "bg-gray-100"
                                                }`}>
                                                <StatusIcon className={
                                                    demande.statut === "en_attente" ? "text-yellow-600" :
                                                        demande.statut === "acceptee" ? "text-green-600" :
                                                            demande.statut === "en_cours" ? "text-blue-600" :
                                                                demande.statut === "livree" ? "text-purple-600" :
                                                                    demande.statut === "refusee" ? "text-red-600" :
                                                                        "text-gray-600"
                                                } size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {demande.annonceId?.lieuDepart?.nom || demande.annonceId?.lieuDepart} → {demande.annonceId?.destination?.nom || demande.annonceId?.destination}
                                                </h3>
                                                <p className="text-sm text-gray-600">{demande.typeColis || 'Type non spécifié'}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(demande.statut)}`}>
                                            {getStatusText(demande.statut)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <CalendarDays className="mr-2 text-gray-500" size={16} />
                                            <span>Demandé le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <Scale className="mr-2 text-gray-500" size={16} />
                                            <span>{demande.poids || 0} kg</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="mr-2 text-gray-500" size={16} />
                                            <span className="font-semibold text-green-600">{demande.annonceId?.prix || 0} MAD</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="mr-2 text-gray-500" size={16} />
                                            <span>{demande.annonceId?.conducteurId?.prenom || 'N/A'} {demande.annonceId?.conducteurId?.nom || ''}</span>
                                        </div>
                                    </div>

                                    {demande.description && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">{demande.description}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                                <Phone size={16} />
                                                <span>Contacter</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                                <Mail size={16} />
                                                <span>Message</span>
                                            </button>
                                        </div>

                                        {demande.statut === 'en_attente' && (
                                            <button
                                                onClick={() => handleCancelRequest(demande._id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Annuler
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredDemandes.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune demande trouvée</h3>
                            <p className="text-gray-500">
                                {demandes.length === 0
                                    ? "Vous n'avez pas encore fait de demandes de transport"
                                    : "Aucune demande ne correspond à vos critères de recherche"
                                }
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyDemandes;
