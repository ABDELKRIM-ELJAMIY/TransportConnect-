import React, { useState, useEffect } from "react";
import { User, Truck, Settings, BarChart3, Camera, Edit, Save, X, Menu, MapPin, Phone, Mail, Calendar, Star, Award, TrendingUp, AlertCircle } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";
import axios from "axios";

const ProfilConducteur = () => {
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

    // Verification request state
    const [requestingVerification, setRequestingVerification] = useState(false);
    const [verificationRequested, setVerificationRequested] = useState(false);

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
        role: "conducteur",
        isVerified: false,
        isActive: true
    });

    // Conducteur specific data
    const [conducteurData, setConducteurData] = useState({
        permisConduire: "",
        vehicule: {
            marque: "",
            modele: "",
            annee: "",
            couleur: "",
            immatriculation: "",
            capaciteMax: "",
            volumeMax: ""
        },
        noteGlobale: 0,
        nombreVoyages: 0,
        nombreEvaluations: 0
    });

    const [vehicleData, setVehicleData] = useState({
        marque: "",
        modele: "",
        annee: "",
        plaque: "",
        capacite: "",
        type: ""
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
                console.log('Profile data received:', userResponse.data.user);
                setProfileData(userResponse.data.user);
            }

            // Fetch conducteur specific data
            const conducteurResponse = await axios.get(`http://localhost:5000/api/users/${userResponse.data.user.id}/conducteur`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (conducteurResponse.data.success) {
                setConducteurData(conducteurResponse.data.data);

                // Update vehicle data
                setVehicleData({
                    marque: conducteurResponse.data.data.vehicule?.marque || "",
                    modele: conducteurResponse.data.data.vehicule?.modele || "",
                    annee: conducteurResponse.data.data.vehicule?.annee || "",
                    plaque: conducteurResponse.data.data.vehicule?.immatriculation || "",
                    capacite: conducteurResponse.data.data.vehicule?.capaciteMax ? `${conducteurResponse.data.data.vehicule.capaciteMax} tonnes` : "",
                    type: "Fourgon"
                });
            }

            // Check for existing verification request
            if (!userResponse.data.user.isVerified) {
                try {
                    const notificationResponse = await axios.get('http://localhost:5000/api/users/verification-status', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (notificationResponse.data.success && notificationResponse.data.hasRequest) {
                        setVerificationRequested(true);
                    }
                } catch (err) {
                    // If the endpoint doesn't exist yet, we'll handle it gracefully
                    console.log('Verification status check not available yet');
                }
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

            // Update conducteur data
            const conducteurUpdateData = {
                permisConduire: conducteurData.permisConduire,
                vehicule: {
                    marque: vehicleData.marque,
                    modele: vehicleData.modele,
                    annee: vehicleData.annee,
                    couleur: conducteurData.vehicule?.couleur || "",
                    immatriculation: vehicleData.plaque,
                    capaciteMax: vehicleData.capacite && vehicleData.capacite.includes(' tonnes')
                        ? parseFloat(vehicleData.capacite.replace(' tonnes', '')) || 0
                        : 0,
                    volumeMax: conducteurData.vehicule?.volumeMax || 0
                }
            };

            console.log('Sending conducteur data:', conducteurUpdateData);

            await axios.put(`http://localhost:5000/api/users/conducteur`, conducteurUpdateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
        // Reset to original data
        fetchProfileData();
    };

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConducteurChange = (field, value) => {
        setConducteurData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleVehicleChange = (field, value) => {
        setVehicleData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleChangePassword = async () => {
        try {
            setChangingPassword(true);
            setError(null);
            setSuccessMessage(null);

            // Validate passwords
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setError('Les nouveaux mots de passe ne correspondent pas');
                return;
            }

            if (passwordData.newPassword.length < 8) {
                setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token non trouvé');
            }

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

    const handleRequestVerification = async () => {
        try {
            setRequestingVerification(true);
            setError(null);
            setSuccessMessage(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token non trouvé');
            }

            await axios.post('http://localhost:5000/api/users/request-verification', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage('Demande de vérification envoyée avec succès. Un administrateur examinera votre profil.');
            setVerificationRequested(true);

        } catch (err) {
            console.error("Error requesting verification:", err);
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi de la demande de vérification');
        } finally {
            setRequestingVerification(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    const tabs = [
        { id: "profile", label: "Profil", icon: User },
        { id: "vehicle", label: "Véhicule", icon: Truck },
        { id: "stats", label: "Statistiques", icon: BarChart3 },
        { id: "password", label: "Mot de Passe", icon: Settings },
        { id: "settings", label: "Paramètres", icon: Settings }
    ];

    const stats = [
        {
            title: "Note Moyenne",
            value: conducteurData.noteGlobale.toFixed(1),
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100"
        },
        {
            title: "Trajets Complétés",
            value: conducteurData.nombreVoyages.toString(),
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            title: "Évaluations",
            value: conducteurData.nombreEvaluations.toString(),
            icon: Award,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            title: "Statut",
            value: profileData.isVerified ? "Vérifié" : "En attente",
            icon: Calendar,
            color: profileData.isVerified ? "text-green-600" : "text-orange-600",
            bgColor: profileData.isVerified ? "bg-green-100" : "bg-orange-100"
        }
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={profileData} />

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
                        Profil Conducteur
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    {/* Error and Success Messages */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                            <AlertCircle className="text-red-600" size={20} />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-green-800">{successMessage}</span>
                        </div>
                    )}

                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                                <div className="relative z-10 flex items-center space-x-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
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
                                                <User size={48} />
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
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">{`${profileData.prenom} ${profileData.nom}`}</h1>
                                        <p className="text-blue-100 mb-1">Conducteur Professionnel</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Star size={16} className="text-yellow-300" />
                                                <span className="font-medium">{conducteurData.noteGlobale.toFixed(1)}</span>
                                            </div>
                                            <span className="text-blue-100">•</span>
                                            <span className="text-blue-100">{conducteurData.nombreVoyages} trajets</span>
                                            {profileData.isVerified ? (
                                                <>
                                                    <span className="text-blue-100">•</span>
                                                    <span className="text-green-300 font-medium">✓ Vérifié</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-blue-100">•</span>
                                                    <span className="text-yellow-300 font-medium">⚠ En attente de vérification</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Image Upload Section */}
                                {imagePreview && (
                                    <div className="mt-6 p-4 bg-white/10 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={imagePreview}
                                                    alt="Aperçu"
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <h3 className="text-white font-medium">Nouvelle image de profil</h3>
                                                    <p className="text-blue-100 text-sm">Cliquez sur Enregistrer pour appliquer</p>
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

                            <div className="p-6">
                                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg flex-1 transition-all duration-300 ${activeTab === tab.id
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-gray-600 hover:text-gray-800"
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                <span className="font-medium">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {activeTab === "profile" && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-bold text-gray-800">Informations Personnelles</h2>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                    <span>Modifier</span>
                                                </button>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={saving}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {saving ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        ) : (
                                                            <Save size={16} />
                                                        )}
                                                        <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={saving}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                                    >
                                                        <X size={16} />
                                                        <span>Annuler</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                                <input
                                                    type="text"
                                                    value={profileData.prenom}
                                                    onChange={(e) => handleProfileChange('prenom', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                                <input
                                                    type="text"
                                                    value={profileData.nom}
                                                    onChange={(e) => handleProfileChange('nom', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => handleProfileChange('email', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                                <input
                                                    type="tel"
                                                    value={profileData.telephone}
                                                    onChange={(e) => handleProfileChange('telephone', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Permis de Conduire</label>
                                                <input
                                                    type="text"
                                                    value={conducteurData.permisConduire}
                                                    onChange={(e) => handleConducteurChange('permisConduire', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`px-3 py-2 rounded-lg ${profileData.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {profileData.isVerified ? 'Vérifié' : 'En attente de vérification'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Verification Request Section */}
                                        {!profileData.isVerified && (
                                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-medium text-yellow-800 mb-2">
                                                            Demande de Vérification
                                                        </h3>
                                                        <p className="text-yellow-700 mb-4">
                                                            Pour être vérifié en tant que conducteur, veuillez vous assurer que toutes vos informations sont complètes et exactes, puis demandez la vérification.
                                                        </p>
                                                        <div className="space-y-2 text-sm text-yellow-700">
                                                            <div className="flex items-center space-x-2">
                                                                <div className={`w-2 h-2 rounded-full ${profileData.nom && profileData.prenom ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                <span>Informations personnelles complètes</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className={`w-2 h-2 rounded-full ${conducteurData.permisConduire ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                <span>Permis de conduire renseigné</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className={`w-2 h-2 rounded-full ${vehicleData.marque && vehicleData.modele ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                <span>Informations véhicule complètes</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={handleRequestVerification}
                                                        disabled={requestingVerification || verificationRequested}
                                                        className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${verificationRequested
                                                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                                            : requestingVerification
                                                                ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                                                                : 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                            }`}
                                                    >
                                                        {verificationRequested
                                                            ? 'Demande Envoyée ✓'
                                                            : requestingVerification
                                                                ? 'Envoi en cours...'
                                                                : 'Demander la Vérification'
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "vehicle" && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-bold text-gray-800">Informations du Véhicule</h2>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                    <span>Modifier</span>
                                                </button>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={saving}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {saving ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        ) : (
                                                            <Save size={16} />
                                                        )}
                                                        <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={saving}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                                    >
                                                        <X size={16} />
                                                        <span>Annuler</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Marque</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.marque}
                                                    onChange={(e) => handleVehicleChange('marque', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.modele}
                                                    onChange={(e) => handleVehicleChange('modele', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.annee}
                                                    onChange={(e) => handleVehicleChange('annee', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Plaque d'Immatriculation</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.plaque}
                                                    onChange={(e) => handleVehicleChange('plaque', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Capacité (tonnes)</label>
                                                <input
                                                    type="number"
                                                    value={vehicleData.capacite.replace(' tonnes', '')}
                                                    onChange={(e) => handleVehicleChange('capacite', `${e.target.value} tonnes`)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                                                <input
                                                    type="text"
                                                    value={conducteurData.vehicule?.couleur || ""}
                                                    onChange={(e) => handleConducteurChange('vehicule', {
                                                        ...conducteurData.vehicule,
                                                        couleur: e.target.value
                                                    })}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "stats" && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-800">Statistiques</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {stats.map((stat, index) => {
                                                const Icon = stat.icon;
                                                return (
                                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                                            </div>
                                                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                                                <Icon className={stat.color} size={24} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "password" && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-bold text-gray-800">Changer le Mot de Passe</h2>
                                        </div>

                                        <div className="max-w-md space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de Passe Actuel</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                    placeholder="Entrez votre mot de passe actuel"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau Mot de Passe</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                    placeholder="Entrez votre nouveau mot de passe"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le Nouveau Mot de Passe</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                    placeholder="Confirmez votre nouveau mot de passe"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={changingPassword}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {changingPassword ? 'Changement en cours...' : 'Changer le Mot de Passe'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "settings" && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-800">Paramètres</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Notifications Push</h3>
                                                    <p className="text-sm text-gray-600">Recevoir des notifications sur votre appareil</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Mode Sombre</h3>
                                                    <p className="text-sm text-gray-600">Activer le thème sombre</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Localisation</h3>
                                                    <p className="text-sm text-gray-600">Partager votre position</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilConducteur; 