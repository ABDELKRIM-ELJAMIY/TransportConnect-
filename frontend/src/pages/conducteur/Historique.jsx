// src/pages/conducteur/Historique.jsx
import React, { useState, useEffect } from "react";
import { MapPin, CalendarDays, Truck, X, Menu, Star, Package, DollarSign, Clock, Filter, Search, Bell } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";
import axios from "axios";

const iconMap = {
    Truck,
    Star,
    Package,
    DollarSign,
    Clock,
    Bell,
};

const Historique = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

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

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/historique', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setHistoryData(response.data.data);
                } else {
                    setError('Erreur lors du chargement de l\'historique.');
                }
            } catch (err) {
                console.error("Historique fetch error:", err);
                setError('Erreur lors du chargement de l\'historique.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchHistory();
    }, []);

    const filters = [
        { value: "all", label: "Tout", icon: Clock },
        { value: "trip", label: "Trajets", icon: Truck },
        { value: "demand", label: "Demandes", icon: Package },
        { value: "rating", label: "Avis", icon: Star },
        { value: "notification", label: "Notifications", icon: Bell },
        { value: "payment", label: "Paiements", icon: DollarSign }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
            case "positive":
                return "bg-green-100 text-green-700";
            case "active":
            case "in_progress":
                return "bg-blue-100 text-blue-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "updated":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "completed":
                return "Terminé";
            case "active":
                return "Actif";
            case "positive":
                return "Positif";
            case "cancelled":
                return "Annulé";
            case "in_progress":
                return "En cours";
            case "updated":
                return "Mis à jour";
            default:
                return status;
        }
    };

    const filteredData = historyData.filter(item => {
        const matchesFilter = selectedFilter === "all" || item.type === selectedFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Chargement de l'historique...</div>;
    }
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />

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
                        Historique Complet
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Historique Complet</h1>

                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans l'historique..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredData.map((item) => {
                            const Icon = iconMap[item.icon] || Clock;
                            return (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.type === "trip" ? "bg-blue-100" :
                                            item.type === "demand" ? "bg-green-100" :
                                                item.type === "rating" ? "bg-yellow-100" :
                                                    item.type === "notification" ? "bg-purple-100" :
                                                        "bg-orange-100"
                                            }`}>
                                            <Icon className={
                                                item.type === "trip" ? "text-blue-600" :
                                                    item.type === "demand" ? "text-green-600" :
                                                        item.type === "rating" ? "text-yellow-600" :
                                                            item.type === "notification" ? "text-purple-600" :
                                                                "text-orange-600"
                                            } size={24} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                                <span className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                                                    {getStatusText(item.status)}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mb-3">{item.description}</p>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center space-x-4">
                                                    <span className="flex items-center">
                                                        <CalendarDays className="mr-1" size={16} />
                                                        {item.date}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="mr-1" size={16} />
                                                        {item.time}
                                                    </span>
                                                </div>

                                                {item.earnings && (
                                                    <span className="font-semibold text-green-600">
                                                        +{item.earnings} MAD
                                                    </span>
                                                )}

                                                {item.rating && (
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={16} className={i < item.rating ? "text-yellow-400" : "text-gray-300"} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun historique trouvé</h3>
                            <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Historique;
