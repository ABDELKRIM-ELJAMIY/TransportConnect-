import React, { useState, useEffect } from "react";
import { MapPin, CalendarDays, Truck, X, Menu, Star, Package, DollarSign, Clock, Filter, Search, Map, Calendar, Weight, User, Phone, Mail, Plus, FileText } from "lucide-react";
import Sidebar from "../../components/expediteur/SidebarExpediteur";
import axios from "axios";

const SearchAnnonces = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    // Search filters
    const [searchTerm, setSearchTerm] = useState("");
    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [dateDepart, setDateDepart] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [cargoType, setCargoType] = useState("");
    const [urgentOnly, setUrgentOnly] = useState(false);

    // Request form modal
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedAnnonce, setSelectedAnnonce] = useState(null);
    const [submittingRequest, setSubmittingRequest] = useState(false);
    const [requestForm, setRequestForm] = useState({
        description: "",
        lieuRecuperation: {
            nom: "",
            adresse: "",
            instructions: ""
        },
        lieuLivraison: {
            nom: "",
            adresse: "",
            instructions: ""
        },
        contactRecuperation: {
            nom: "",
            telephone: ""
        },
        contactLivraison: {
            nom: "",
            telephone: ""
        },
        datePreferenceRecuperation: "",
        datePreferenceLivraison: "",
        assuranceRequise: false,
        instructionsSpeciales: ""
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

    // Fetch all announcements
    const fetchAnnonces = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/annonces?page=1&limit=50', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setAnnonces(response.data.data.annonces || response.data.annonces || []);
            } else {
                setError('Erreur lors du chargement des annonces.');
            }
        } catch (err) {
            console.error("Error fetching annonces:", err);
            setError('Erreur lors du chargement des annonces.');
        } finally {
            setLoading(false);
        }
    };

    // Open request modal
    const handleOpenRequestModal = (annonce) => {
        setSelectedAnnonce(annonce);
        setShowRequestModal(true);
        // Pre-fill some fields based on annonce data
        setRequestForm(prev => ({
            ...prev,
            lieuRecuperation: {
                ...prev.lieuRecuperation,
                nom: annonce.lieuDepart?.nom || annonce.lieuDepart || ""
            },
            lieuLivraison: {
                ...prev.lieuLivraison,
                nom: annonce.destination?.nom || annonce.destination || ""
            }
        }));
    };

    // Handle form field changes
    const handleFormChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setRequestForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setRequestForm(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    // Submit transport request
    const handleSubmitRequest = async () => {
        try {
            // Validate required fields
            const requiredFields = [
                { field: 'description', value: requestForm.description, label: 'Description' },
                { field: 'lieuRecuperation.nom', value: requestForm.lieuRecuperation.nom, label: 'Nom du lieu de récupération' },
                { field: 'lieuLivraison.nom', value: requestForm.lieuLivraison.nom, label: 'Nom du lieu de livraison' },
                { field: 'contactRecuperation.nom', value: requestForm.contactRecuperation.nom, label: 'Nom du contact de récupération' },
                { field: 'contactRecuperation.telephone', value: requestForm.contactRecuperation.telephone, label: 'Téléphone du contact de récupération' },
                { field: 'contactLivraison.nom', value: requestForm.contactLivraison.nom, label: 'Nom du contact de livraison' },
                { field: 'contactLivraison.telephone', value: requestForm.contactLivraison.telephone, label: 'Téléphone du contact de livraison' }
            ];

            const missingFields = requiredFields.filter(field => !field.value);

            if (missingFields.length > 0) {
                alert('Veuillez remplir tous les champs obligatoires:\n' +
                    missingFields.map(field => `- ${field.label}`).join('\n'));
                return;
            }

            // Validate phone number format (French format)
            const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
            const phoneFields = [
                { field: 'contactRecuperation.telephone', value: requestForm.contactRecuperation.telephone, label: 'Téléphone du contact de récupération' },
                { field: 'contactLivraison.telephone', value: requestForm.contactLivraison.telephone, label: 'Téléphone du contact de livraison' }
            ];

            const invalidPhoneFields = phoneFields.filter(field => !phoneRegex.test(field.value));

            if (invalidPhoneFields.length > 0) {
                alert('Veuillez entrer des numéros de téléphone valides (format français) pour:\n' +
                    invalidPhoneFields.map(field => `- ${field.label}`).join('\n') +
                    '\n\nFormat attendu: 0XXXXXXXXX, +33XXXXXXXXX, ou 0033XXXXXXXXX');
                return;
            }

            setSubmittingRequest(true);
            const token = localStorage.getItem('token');

            const requestData = {
                annonceId: selectedAnnonce._id,
                ...requestForm,
                datePreferenceRecuperation: requestForm.datePreferenceRecuperation || undefined,
                datePreferenceLivraison: requestForm.datePreferenceLivraison || undefined
            };

            console.log('Submitting request data:', requestData);

            const response = await axios.post('http://localhost:5000/api/demandes', requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Response:', response.data);

            alert('Demande envoyée avec succès!');
            setShowRequestModal(false);
            setSelectedAnnonce(null);
            // Reset form
            setRequestForm({
                description: "",
                lieuRecuperation: { nom: "", adresse: "", instructions: "" },
                lieuLivraison: { nom: "", adresse: "", instructions: "" },
                contactRecuperation: { nom: "", telephone: "" },
                contactLivraison: { nom: "", telephone: "" },
                datePreferenceRecuperation: "",
                datePreferenceLivraison: "",
                assuranceRequise: false,
                instructionsSpeciales: ""
            });
        } catch (err) {
            console.error("Error submitting request:", err);
            console.error("Error response:", err.response?.data);

            let errorMessage = 'Erreur lors de l\'envoi de la demande';

            if (err.response?.data?.message) {
                errorMessage += ': ' + err.response.data.message;
            }

            if (err.response?.data?.errors) {
                errorMessage += '\n\nDétails:\n' + err.response.data.errors.map(e =>
                    `${e.field}: ${e.message}`
                ).join('\n');
            }

            alert(errorMessage);
        } finally {
            setSubmittingRequest(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchAnnonces();
    }, []);

    // Filter announcements based on search criteria
    const filteredAnnonces = annonces.filter(annonce => {
        const matchesSearch = annonce.lieuDepart?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            annonce.destination?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            annonce.typeMarchandise?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDeparture = !departure || annonce.lieuDepart?.nom?.toLowerCase().includes(departure.toLowerCase());
        const matchesDestination = !destination || annonce.destination?.nom?.toLowerCase().includes(destination.toLowerCase());
        const matchesDate = !dateDepart || new Date(annonce.dateDepart).toDateString() === new Date(dateDepart).toDateString();
        const matchesPrice = !maxPrice || annonce.prix <= parseInt(maxPrice);
        const matchesCargo = !cargoType || annonce.typeMarchandise?.toLowerCase().includes(cargoType.toLowerCase());
        const matchesUrgent = !urgentOnly || annonce.isUrgent;

        return matchesSearch && matchesDeparture && matchesDestination && matchesDate && matchesPrice && matchesCargo && matchesUrgent;
    });

    const cargoTypes = [
        "Électronique", "Vêtements", "Alimentation", "Mobilier", "Machines",
        "Documents", "Médicaments", "Automobile", "Construction", "Autre"
    ];

    const colisTypes = [
        { value: "normale", label: "Normale" },
        { value: "fragile", label: "Fragile" },
        { value: "dangereuse", label: "Dangereuse" },
        { value: "alimentaire", label: "Alimentaire" },
        { value: "electronique", label: "Électronique" },
        { value: "autre", label: "Autre" }
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />
                <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement des annonces...</p>
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
                        Rechercher des Transports
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    {/* Search Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtres de Recherche</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche générale</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de départ</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Départ"
                                        value={departure}
                                        onChange={(e) => setDeparture(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Destination"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date de départ</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        value={dateDepart}
                                        onChange={(e) => setDateDepart(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prix maximum (MAD)</label>
                                <input
                                    type="number"
                                    placeholder="Prix max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type de marchandise</label>
                                <select
                                    value={cargoType}
                                    onChange={(e) => setCargoType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Tous les types</option>
                                    {cargoTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center">
                            <input
                                type="checkbox"
                                id="urgentOnly"
                                checked={urgentOnly}
                                onChange={(e) => setUrgentOnly(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="urgentOnly" className="text-sm text-gray-700">
                                Transports urgents uniquement
                            </label>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {filteredAnnonces.length} annonce{filteredAnnonces.length !== 1 ? 's' : ''} trouvée{filteredAnnonces.length !== 1 ? 's' : ''}
                        </h3>
                    </div>

                    {/* Announcements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAnnonces.map((annonce) => (
                            <div key={annonce._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-gray-800 font-semibold">
                                        <MapPin className="mr-2 text-green-600" size={20} />
                                        {annonce.lieuDepart?.nom || annonce.lieuDepart} → {annonce.destination?.nom || annonce.destination}
                                    </div>
                                    {annonce.isUrgent && (
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                            URGENT
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <CalendarDays className="mr-2 text-gray-500" size={16} />
                                        Départ: {new Date(annonce.dateDepart).toLocaleDateString('fr-FR')}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Package className="mr-2 text-gray-500" size={16} />
                                        {annonce.typeMarchandise}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Weight className="mr-2 text-gray-500" size={16} />
                                        Jusqu'à {annonce.poidsMaximum} kg
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <DollarSign className="mr-2 text-gray-500" size={16} />
                                        <span className="font-semibold text-green-600">{annonce.prix} MAD</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="mr-2 text-gray-500" size={16} />
                                        {annonce.conducteur?.prenom} {annonce.conducteur?.nom}
                                        {annonce.conducteur?.isVerified && (
                                            <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                ✓ Vérifié
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleOpenRequestModal(annonce)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
                                    >
                                        <Plus size={16} />
                                        <span>Demander Transport</span>
                                    </button>

                                    <div className="flex items-center space-x-2">
                                        <Phone className="text-gray-500" size={16} />
                                        <Mail className="text-gray-500" size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredAnnonces.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune annonce trouvée</h3>
                            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}
                </div>

                {/* Request Modal */}
                {showRequestModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">Demande de Transport</h2>
                                    <button
                                        onClick={() => setShowRequestModal(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                {selectedAnnonce && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        {selectedAnnonce.lieuDepart?.nom || selectedAnnonce.lieuDepart} → {selectedAnnonce.destination?.nom || selectedAnnonce.destination}
                                    </p>
                                )}
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description du colis *
                                    </label>
                                    <textarea
                                        value={requestForm.description}
                                        onChange={(e) => handleFormChange('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Décrivez votre colis..."
                                    />
                                </div>

                                {/* Pickup Location */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Lieu de récupération</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom du lieu *
                                            </label>
                                            <input
                                                type="text"
                                                value={requestForm.lieuRecuperation.nom}
                                                onChange={(e) => handleFormChange('lieuRecuperation.nom', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Adresse
                                            </label>
                                            <input
                                                type="text"
                                                value={requestForm.lieuRecuperation.adresse}
                                                onChange={(e) => handleFormChange('lieuRecuperation.adresse', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Instructions de récupération
                                        </label>
                                        <textarea
                                            value={requestForm.lieuRecuperation.instructions}
                                            onChange={(e) => handleFormChange('lieuRecuperation.instructions', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                {/* Delivery Location */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Lieu de livraison</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom du lieu *
                                            </label>
                                            <input
                                                type="text"
                                                value={requestForm.lieuLivraison.nom}
                                                onChange={(e) => handleFormChange('lieuLivraison.nom', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Adresse
                                            </label>
                                            <input
                                                type="text"
                                                value={requestForm.lieuLivraison.adresse}
                                                onChange={(e) => handleFormChange('lieuLivraison.adresse', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Instructions de livraison
                                        </label>
                                        <textarea
                                            value={requestForm.lieuLivraison.instructions}
                                            onChange={(e) => handleFormChange('lieuLivraison.instructions', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                {/* Contacts */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacts</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-3">Contact de récupération</h4>
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Nom *"
                                                    value={requestForm.contactRecuperation.nom}
                                                    onChange={(e) => handleFormChange('contactRecuperation.nom', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                                <div>
                                                    <input
                                                        type="tel"
                                                        placeholder="Téléphone * (ex: 0612345678)"
                                                        value={requestForm.contactRecuperation.telephone}
                                                        onChange={(e) => handleFormChange('contactRecuperation.telephone', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">Format: 0XXXXXXXXX, +33XXXXXXXXX, ou 0033XXXXXXXXX</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-3">Contact de livraison</h4>
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Nom *"
                                                    value={requestForm.contactLivraison.nom}
                                                    onChange={(e) => handleFormChange('contactLivraison.nom', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                                <div>
                                                    <input
                                                        type="tel"
                                                        placeholder="Téléphone * (ex: 0612345678)"
                                                        value={requestForm.contactLivraison.telephone}
                                                        onChange={(e) => handleFormChange('contactLivraison.telephone', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">Format: 0XXXXXXXXX, +33XXXXXXXXX, ou 0033XXXXXXXXX</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Options supplémentaires</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="assuranceRequise"
                                                checked={requestForm.assuranceRequise}
                                                onChange={(e) => handleFormChange('assuranceRequise', e.target.checked)}
                                                className="mr-2"
                                            />
                                            <label htmlFor="assuranceRequise" className="text-sm text-gray-700">
                                                Assurance requise
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Instructions spéciales
                                            </label>
                                            <textarea
                                                value={requestForm.instructionsSpeciales}
                                                onChange={(e) => handleFormChange('instructionsSpeciales', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                rows={2}
                                                placeholder="Instructions spéciales pour le transport..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowRequestModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSubmitRequest}
                                    disabled={submittingRequest}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {submittingRequest ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Envoi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={16} />
                                            <span>Envoyer la demande</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchAnnonces;
