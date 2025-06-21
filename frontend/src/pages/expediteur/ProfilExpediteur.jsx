import React, { useState, useEffect } from "react";
import { User, Package, Settings, BarChart3, Camera, Edit, Save, X, Menu, MapPin, Phone, Mail, Calendar, Star, Award, TrendingUp, AlertCircle, Truck, DollarSign, History } from "lucide-react";
import Sidebar from "../../components/expediteur/SidebarExpediteur";
import axios from "axios";

const ProfilExpediteur = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // Profile image state
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Profile data from backend
    const [profileData, setProfileData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        role: "expediteur",
        isVerified: false,
        isActive: true
    });

    // Expediteur specific data
    const [expediteurData, setExpediteurData] = useState({
        noteGlobale: 0,
        nombreEnvois: 0,
        nombreEvaluations: 0,
        adressePrincipale: {
            rue: "",
            ville: "",
            codePostal: "",
            pays: "Maroc"
        },
        isActive: true
    });

    // Statistics
    const [stats, setStats] = useState({
        totalDemandes: 0,
        demandesAcceptees: 0,
        demandesLivrees: 0,
        totalDepense: 0,
        moyennePrix: 0
    });

    // Helper function to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    // Fetch user profile data
    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token non trouvé');
            }

            // Fetch user profile
            const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (userResponse.data.success) {
                setProfileData(userResponse.data.user);
            }

            // Fetch expediteur specific data
            try {
                const expediteurResponse = await axios.get(`http://localhost:5000/api/users/${userResponse.data.user.id}/expediteur`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (expediteurResponse.data.success) {
                    setExpediteurData(expediteurResponse.data.data);
                }
            } catch (err) {
                // If expediteur data doesn't exist yet, use defaults
                console.log('Using default expediteur data');
                setExpediteurData({
                    noteGlobale: 0,
                    nombreEnvois: 0,
                    nombreEvaluations: 0,
                    adressePrincipale: {
                        rue: "",
                        ville: "",
                        codePostal: "",
                        pays: "Maroc"
                    },
                    isActive: true
                });
            }

            // Fetch demandes statistics
            try {
                const demandesResponse = await axios.get('http://localhost:5000/api/demandes/mine', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (demandesResponse.data.success) {
                    const demandes = demandesResponse.data.data?.demandes || demandesResponse.data.demandes || [];

                    const totalDemandes = demandes.length;
                    const demandesAcceptees = demandes.filter(d => d.statut === 'acceptee').length;
                    const demandesLivrees = demandes.filter(d => d.statut === 'livree').length;
                    const totalDepense = demandes
                        .filter(d => d.statut === 'livree' && d.annonceId?.prix)
                        .reduce((sum, d) => sum + (d.annonceId.prix || 0), 0);
                    const moyennePrix = demandesLivrees > 0 ? totalDepense / demandesLivrees : 0;

                    setStats({
                        totalDemandes,
                        demandesAcceptees,
                        demandesLivrees,
                        totalDepense,
                        moyennePrix
                    });
                }
            } catch (err) {
                console.log('Demandes statistics not available yet');
            }

        } catch (err) {
            console.error("Error fetching profile:", err);
            setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
        } finally {
            setLoading(false);
        }
    };

    // Update profile data
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token non trouvé');
            }

            // Update user profile
            const updateData = {
                nom: profileData.nom,
                prenom: profileData.prenom,
                email: profileData.email,
                telephone: profileData.telephone
            };

            await axios.put(`http://localhost:5000/api/users/profile`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update expediteur data
            const expediteurUpdateData = {
                adressePrincipale: expediteurData.adressePrincipale
            };

            try {
                await axios.put(`http://localhost:5000/api/users/expediteur`, expediteurUpdateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.log('Expediteur update endpoint not available yet');
            }

            setSuccessMessage('Profil mis à jour avec succès');
            setIsEditing(false);

            // Refresh data
            await fetchProfileData();

        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
        setSuccessMessage(null);
        fetchProfileData(); // Reset to original data
    };

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleExpediteurChange = (field, value) => {
        setExpediteurData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field, value) => {
        setExpediteurData(prev => ({
            ...prev,
            adressePrincipale: {
                ...prev.adressePrincipale,
                [field]: value
            }
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        try {
            setChangingPassword(true);
            setError(null);

            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage('Mot de passe modifié avec succès');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (err) {
            console.error("Error changing password:", err);
            setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Veuillez sélectionner une image valide');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('L\'image ne doit pas dépasser 5MB');
                return;
            }

            setProfileImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageSave = async () => {
        if (!profileImage) {
            setError('Veuillez sélectionner une image');
            return;
        }

        try {
            setUploadingImage(true);
            setError(null);
            setSuccessMessage(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token non trouvé');
            }

            const formData = new FormData();
            formData.append('profileImage', profileImage);

            const response = await axios.post('http://localhost:5000/api/users/upload-profile-image', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Image upload response:', response.data);
            setSuccessMessage('Image de profil mise à jour avec succès');
            setProfileImage(null);
            setImagePreview(null);

            // Refresh profile data to get the new image URL
            await fetchProfileData();

        } catch (err) {
            console.error("Error uploading image:", err);
            setError(err.response?.data?.message || 'Erreur lors du téléchargement de l\'image');
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={profileData} />
                <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement du profil...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={profileData} />

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
                        Mon Profil Expéditeur
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800">{successMessage}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Profile Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Aperçu"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : profileData.profileImage ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={getImageUrl(profileData.profileImage)}
                                                alt="Photo de profil"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error('Image failed to load:', getImageUrl(profileData.profileImage));
                                                    e.target.style.display = 'none';
                                                    // Show fallback icon
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                                onLoad={() => console.log('Image loaded successfully:', getImageUrl(profileData.profileImage))}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/20" style={{ display: 'none' }}>
                                                <User size={48} className="text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <User size={48} className="text-white" />
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <Camera size={16} className="text-gray-600" />
                                </label>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    {profileData.prenom} {profileData.nom}
                                </h1>
                                <p className="text-gray-600 mb-2">Expéditeur</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Mail size={16} />
                                        <span>{profileData.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Phone size={16} />
                                        <span>{profileData.telephone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                    >
                                        <Edit size={16} />
                                        <span>Modifier</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        {imagePreview && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={imagePreview}
                                            alt="Aperçu"
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div>
                                            <h3 className="text-green-800 font-medium">Nouvelle image de profil</h3>
                                            <p className="text-green-600 text-sm">Cliquez sur Enregistrer pour appliquer</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleImageSave}
                                            disabled={uploadingImage}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {uploadingImage ? 'Enregistrement...' : 'Enregistrer'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setImagePreview(null);
                                                setProfileImage(null);
                                            }}
                                            disabled={uploadingImage}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: "profile", label: "Profil", icon: User },
                                    { id: "address", label: "Adresse", icon: MapPin },
                                    { id: "security", label: "Sécurité", icon: Settings }
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                ? "border-green-500 text-green-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <Icon size={16} />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.prenom}
                                                onChange={(e) => handleProfileChange('prenom', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.nom}
                                                onChange={(e) => handleProfileChange('nom', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.telephone}
                                                onChange={(e) => handleProfileChange('telephone', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Address Tab */}
                            {activeTab === "address" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Rue
                                            </label>
                                            <input
                                                type="text"
                                                value={expediteurData.adressePrincipale?.rue || ""}
                                                onChange={(e) => handleAddressChange('rue', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ville
                                            </label>
                                            <input
                                                type="text"
                                                value={expediteurData.adressePrincipale?.ville || ""}
                                                onChange={(e) => handleAddressChange('ville', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Code Postal
                                            </label>
                                            <input
                                                type="text"
                                                value={expediteurData.adressePrincipale?.codePostal || ""}
                                                onChange={(e) => handleAddressChange('codePostal', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pays
                                            </label>
                                            <input
                                                type="text"
                                                value={expediteurData.adressePrincipale?.pays || "Maroc"}
                                                onChange={(e) => handleAddressChange('pays', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === "security" && (
                                <div className="space-y-6">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-yellow-800 mb-2">Changer le mot de passe</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Mot de passe actuel
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nouveau mot de passe
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirmer le nouveau mot de passe
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={changingPassword}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                {changingPassword ? 'Modification...' : 'Modifier le mot de passe'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilExpediteur; 