import React, { useState, useEffect } from "react";
import { X, Menu, Package, User, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Truck } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MesDemandes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [demandes, setDemandes] = useState([]);
    const [selectedAnnonce, setSelectedAnnonce] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

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

    // Fetch all demandes for conducteur's annonces
    const fetchDemandes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            console.log('Fetching demandes for conducteur');

            // Use the new endpoint that gets all demandes for all annonces of the conducteur
            const response = await axios.get('http://localhost:5000/api/demandes/mine-conducteur?page=1&limit=100', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Response from mine-conducteur:', response.data);

            // Handle different response structures
            let demandes = [];
            if (response.data.success && response.data.data && response.data.data.demandes) {
                demandes = response.data.data.demandes;
            } else if (response.data.success && response.data.demandes) {
                demandes = response.data.demandes;
            } else if (Array.isArray(response.data)) {
                demandes = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                demandes = response.data.data;
            }

            console.log('All demandes:', demandes);

            // Add annonce info to each demande if not already populated
            const demandesWithAnnonce = demandes.map(demande => {
                const annonceInfo = demande.annonceId ? {
                    lieuDepart: demande.annonceId.lieuDepart,
                    destination: demande.annonceId.destination,
                    dateDepart: demande.annonceId.dateDepart,
                    prix: demande.annonceId.prix
                } : {};

                return {
                    ...demande,
                    annonceInfo
                };
            });

            setDemandes(demandesWithAnnonce);
        } catch (error) {
            console.error('Error fetching demandes:', error);
            toast.error('Erreur lors du chargement des demandes');
        } finally {
            setLoading(false);
        }
    };

    // Manual refresh function
    const handleRefresh = async () => {
        await fetchDemandes();
    };

    // Test API function
    const testAPI = async () => {
        const token = localStorage.getItem('token');

        try {
            console.log('Testing mine-conducteur API');
            const response = await axios.get('http://localhost:5000/api/demandes/mine-conducteur?page=1&limit=10', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('API Response:', response);
            console.log('Response data:', response.data);

            toast.success(`API test successful. Found ${response.data.data?.demandes?.length || 0} demandes`);
        } catch (error) {
            console.error('API Test Error:', error);
            toast.error(`API test failed: ${error.response?.data?.message || error.message}`);
        }
    };

    // Handle demande status update
    const handleStatusUpdate = async (demandeId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/demandes/${demandeId}/status`,
                { statut: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(`Demande ${getStatusLabel(newStatus)} avec succès`);

            // Refresh demandes
            await fetchDemandes();
        } catch (error) {
            console.error('Error updating demande status:', error);
            toast.error('Erreur lors de la mise à jour du statut');
        }
    };

    // Get status label
    const getStatusLabel = (status) => {
        const statusLabels = {
            'en_attente': 'En attente',
            'acceptee': 'Acceptée',
            'refusee': 'Refusée',
            'en_cours': 'En cours',
            'livree': 'Livrée',
            'annulee': 'Annulée'
        };
        return statusLabels[status] || status;
    };

    // Get status color
    const getStatusColor = (status) => {
        const statusColors = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'acceptee': 'bg-green-100 text-green-800',
            'refusee': 'bg-red-100 text-red-800',
            'en_cours': 'bg-blue-100 text-blue-800',
            'livree': 'bg-gray-100 text-gray-800',
            'annulee': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'en_attente':
                return <Clock size={16} />;
            case 'acceptee':
                return <CheckCircle size={16} />;
            case 'refusee':
                return <XCircle size={16} />;
            case 'en_cours':
                return <Truck size={16} />;
            case 'livree':
                return <CheckCircle size={16} />;
            case 'annulee':
                return <XCircle size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    // Filter demandes
    const filteredDemandes = demandes.filter(demande => {
        const demandeAnnonceId = demande.annonceId?.toString() || demande.annonceId?._id?.toString();
        const matchesAnnonce = selectedAnnonce === 'all' || demandeAnnonceId === selectedAnnonce;
        const matchesStatus = selectedStatus === 'all' || demande.statut === selectedStatus;
        return matchesAnnonce && matchesStatus;
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        fetchDemandes();
    }, []);

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
                <div className="bg-white/95 backdrop-blur-xl p-4 shadow-sm flex items-center border-b border-gray-200/50 sticky top-0 z-30 relative">
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

                    <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Mes Demandes de Transport
                    </h1>
                </div>

                <div className="p-6">
                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtres</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Annonce</label>
                                <select
                                    value={selectedAnnonce}
                                    onChange={(e) => setSelectedAnnonce(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">Toutes les annonces</option>
                                    {demandes
                                        .filter((demande, index, self) => {
                                            const annonceId = demande.annonceId?.toString() || demande.annonceId?._id?.toString();
                                            return index === self.findIndex(d => {
                                                const dAnnonceId = d.annonceId?.toString() || d.annonceId?._id?.toString();
                                                return dAnnonceId === annonceId;
                                            });
                                        })
                                        .map((demande, index) => {
                                            const annonceId = demande.annonceId?.toString() || demande.annonceId?._id?.toString();
                                            return (
                                                <option key={`annonce-${index}-${annonceId}`} value={annonceId}>
                                                    {demande.annonceInfo?.lieuDepart?.nom} → {demande.annonceInfo?.destination?.nom}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="en_attente">En attente</option>
                                    <option value="acceptee">Acceptée</option>
                                    <option value="refusee">Refusée</option>
                                    <option value="en_cours">En cours</option>
                                    <option value="livree">Livrée</option>
                                    <option value="annulee">Annulée</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {filteredDemandes.length} demande{filteredDemandes.length !== 1 ? 's' : ''} trouvée{filteredDemandes.length !== 1 ? 's' : ''}
                        </h3>
                    </div>

                    {/* Demandes List */}
                    <div className="space-y-4">
                        {filteredDemandes.map((demande) => (
                            <div key={demande._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Package className="text-green-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                Demande de {demande.expediteurId?.prenom} {demande.expediteurId?.nom}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {demande.annonceInfo?.lieuDepart?.nom} → {demande.annonceInfo?.destination?.nom}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(demande.statut)}`}>
                                        {getStatusIcon(demande.statut)}
                                        <span>{getStatusLabel(demande.statut)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="mr-2 text-gray-500" size={16} />
                                        <span>Demande: {new Date(demande.createdAt).toLocaleDateString('fr-FR')}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="mr-2 text-gray-500" size={16} />
                                        <span>Départ: {new Date(demande.annonceInfo?.dateDepart).toLocaleDateString('fr-FR')}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Package className="mr-2 text-gray-500" size={16} />
                                        <span>Type: {demande.typeColis}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-semibold text-green-600">{demande.annonceInfo?.prix} MAD</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="font-medium text-gray-700 mb-2">Description</h5>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {demande.description}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-2">Contact de récupération</h5>
                                        <div className="text-sm text-gray-600">
                                            <p><strong>{demande.contactRecuperation?.nom}</strong></p>
                                            <p>{demande.contactRecuperation?.telephone}</p>
                                            <p className="text-xs text-gray-500">{demande.lieuRecuperation?.nom}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-2">Contact de livraison</h5>
                                        <div className="text-sm text-gray-600">
                                            <p><strong>{demande.contactLivraison?.nom}</strong></p>
                                            <p>{demande.contactLivraison?.telephone}</p>
                                            <p className="text-xs text-gray-500">{demande.lieuLivraison?.nom}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {demande.statut === 'en_attente' && (
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleStatusUpdate(demande._id, 'acceptee')}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(demande._id, 'refusee')}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        >
                                            Refuser
                                        </button>
                                    </div>
                                )}

                                {demande.statut === 'acceptee' && (
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleStatusUpdate(demande._id, 'en_cours')}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        >
                                            Commencer le transport
                                        </button>
                                    </div>
                                )}

                                {demande.statut === 'en_cours' && (
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleStatusUpdate(demande._id, 'livree')}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        >
                                            Marquer comme livrée
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredDemandes.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune demande trouvée</h3>
                            <p className="text-gray-500">Aucune demande ne correspond à vos critères de recherche</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MesDemandes; 