import React, { useState } from "react";
import { User, Truck, Settings, BarChart3, Camera, Edit, Save, X, Menu, MapPin, Phone, Mail, Calendar, Star, Award, TrendingUp } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const ProfilConducteur = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        nom: "Ahmed Benali",
        email: "ahmed.benali@email.com",
        telephone: "+212 6 12 34 56 78",
        adresse: "123 Rue Mohammed V, Casablanca",
        dateNaissance: "1985-03-15",
        permisConduire: "B123456789",
        experience: "8 ans",
        note: 4.8,
        trajetsCompletes: 156,
        revenuTotal: 45000,
        trajetsCeMois: 12
    });

    const [vehicleData, setVehicleData] = useState({
        marque: "Mercedes-Benz",
        modele: "Sprinter",
        annee: "2020",
        plaque: "12345-A-6",
        capacite: "3 tonnes",
        type: "Fourgon"
    });

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const tabs = [
        { id: "profile", label: "Profil", icon: User },
        { id: "vehicle", label: "Véhicule", icon: Truck },
        { id: "stats", label: "Statistiques", icon: BarChart3 },
        { id: "settings", label: "Paramètres", icon: Settings }
    ];

    const stats = [
        {
            title: "Note Moyenne",
            value: "4.8",
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100"
        },
        {
            title: "Trajets Complétés",
            value: "156",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            title: "Revenu Total",
            value: "45,000 MAD",
            icon: Award,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            title: "Ce Mois",
            value: "12 trajets",
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ];

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
                        Profil Conducteur
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                                <div className="relative z-10 flex items-center space-x-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                            <User size={48} />
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                            <Camera size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">{profileData.nom}</h1>
                                        <p className="text-blue-100 mb-1">Conducteur Professionnel</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Star size={16} className="text-yellow-300" />
                                                <span className="font-medium">{profileData.note}</span>
                                            </div>
                                            <span className="text-blue-100">•</span>
                                            <span className="text-blue-100">{profileData.trajetsCompletes} trajets</span>
                                        </div>
                                    </div>
                                </div>
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
                                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        <Save size={16} />
                                                        <span>Enregistrer</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                                    >
                                                        <X size={16} />
                                                        <span>Annuler</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom Complet</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date de Naissance</label>
                                                <input
                                                    type="date"
                                                    value={profileData.dateNaissance}
                                                    onChange={(e) => handleProfileChange('dateNaissance', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                                                <input
                                                    type="text"
                                                    value={profileData.adresse}
                                                    onChange={(e) => handleProfileChange('adresse', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Permis de Conduire</label>
                                                <input
                                                    type="text"
                                                    value={profileData.permisConduire}
                                                    onChange={(e) => handleProfileChange('permisConduire', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Expérience</label>
                                                <input
                                                    type="text"
                                                    value={profileData.experience}
                                                    onChange={(e) => handleProfileChange('experience', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "vehicle" && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-800">Informations du Véhicule</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Marque</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.marque}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.modele}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.annee}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Plaque d'Immatriculation</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.plaque}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.capacite}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Type de Véhicule</label>
                                                <input
                                                    type="text"
                                                    value={vehicleData.type}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
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